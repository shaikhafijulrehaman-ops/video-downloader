const BasePlatform = require('./BasePlatform');
const logger = require('../utils/logger');

class InstagramPlatform extends BasePlatform {
  constructor() {
    super('instagram', 'Instagram');
  }

  detect(parsedUrl) {
    const host = parsedUrl.hostname.toLowerCase();
    return host === 'instagram.com' || host.endsWith('.instagram.com');
  }

  validate(parsedUrl) {
    const pathname = parsedUrl.pathname;
    // Matches /reel/xyz, /reels/xyz, /p/xyz, /tv/xyz
    const match = pathname.match(/^\/(?:reel|reels|p|tv)\/([a-zA-Z0-9_-]+)/i);

    if (!match || !match[1]) {
      return {
        valid: false,
        error: 'Please enter a valid Instagram Reel, Video, or Post URL.'
      };
    }

    const shortcode = match[1];
    let mediaType = 'Instagram Post';
    if (pathname.includes('/reel')) {
      mediaType = 'Instagram Reel';
    } else if (pathname.includes('/tv/')) {
      mediaType = 'Instagram Video';
    }

    const normalizedUrl = `https://www.instagram.com/reel/${shortcode}/`;

    return {
      valid: true,
      mediaId: shortcode,
      mediaType,
      normalizedUrl
    };
  }

  async getPreview(normalizedUrl, validationInfo) {
    const { mediaId, mediaType } = validationInfo;
    let title = `${mediaType} (${mediaId})`;
    let author = 'Instagram Creator';
    let authorUrl = `https://www.instagram.com/reel/${mediaId}/`;
    let thumbnail = null;

    try {
      // 1. Try public oEmbed
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const oembedUrl = `https://api.instagram.com/oembed/?url=${encodeURIComponent(normalizedUrl)}`;
      const response = await fetch(oembedUrl, {
        signal: controller.signal,
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) DownloadHub/1.0' }
      });
      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        title = data.title || title;
        author = data.author_name ? `@${data.author_name}` : author;
        authorUrl = data.author_url || authorUrl;
        thumbnail = data.thumbnail_url || thumbnail;
      }
    } catch (err) {
      logger.warn('Instagram oEmbed fallback', { error: err.message });
    }

    // 2. If thumbnail is still null, generate reliable thumbnail reference
    if (!thumbnail) {
      thumbnail = `https://www.instagram.com/p/${mediaId}/media/?size=l`;
    }

    return {
      platform: this.name,
      platformLabel: this.label,
      mediaType,
      mediaId,
      title: title.length > 90 ? `${title.slice(0, 87)}...` : title,
      author,
      authorUrl,
      thumbnail,
      originalUrl: normalizedUrl
    };
  }

  async getDownloadInfo(normalizedUrl, validationInfo, previewData) {
    const { mediaId } = validationInfo;
    let downloadUrl = null;
    let downloadAvailable = false;
    let message = null;

    // 1. Check if an external RapidAPI or Media Downloader Key is configured
    const apiKey = process.env.RAPIDAPI_KEY || process.env.INSTAGRAM_API_KEY;
    const apiHost = process.env.RAPIDAPI_HOST || 'instagram-downloader-download-instagram-videos-stories.p.rapidapi.com';

    if (apiKey) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 7000);

        const res = await fetch(`https://${apiHost}/index?url=${encodeURIComponent(normalizedUrl)}`, {
          signal: controller.signal,
          headers: {
            'x-rapidapi-key': apiKey,
            'x-rapidapi-host': apiHost
          }
        });
        clearTimeout(timeoutId);

        if (res.ok) {
          const data = await res.json();
          // Support standard RapidAPI result formats
          if (data.result && Array.isArray(data.result) && data.result.length > 0) {
            const videoItem = data.result.find(item => item.video || item.type?.includes('video') || item.url?.includes('.mp4')) || data.result[0];
            downloadUrl = videoItem.video || videoItem.url;
            if (videoItem.thumb && !previewData.thumbnail) {
              previewData.thumbnail = videoItem.thumb;
            }
          } else if (data.url && (data.url.includes('.mp4') || data.type === 'video')) {
            downloadUrl = data.url;
          } else if (data.media && typeof data.media === 'string') {
            downloadUrl = data.media;
          }
        }
      } catch (err) {
        logger.warn('RapidAPI Instagram resolver error:', { error: err.message });
      }
    }

    // 2. Direct public embed media extraction
    if (!downloadUrl) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 6000);

        const embedRes = await fetch(`https://www.instagram.com/reel/${mediaId}/embed/captioned/`, {
          signal: controller.signal,
          headers: {
            'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
          }
        });
        clearTimeout(timeoutId);

        if (embedRes.ok) {
          const html = await embedRes.text();

          // Helper to cleanly unescape Instagram JSON strings
          const cleanEscapedUrl = (raw) => {
            if (!raw) return null;
            return raw
              .replace(/\\\\\//g, '/')
              .replace(/\\\//g, '/')
              .replace(/\\u0026/g, '&')
              .replace(/\\u0025/g, '%');
          };

          // Robust extraction of video_url
          const vIdx = html.indexOf('video_url');
          if (vIdx !== -1) {
            const start = html.indexOf('http', vIdx);
            if (start !== -1 && start - vIdx < 25) {
              let end = start;
              while (end < html.length) {
                if (html[end] === '"' && html[end - 1] !== '\\') break;
                if (html[end] === '\\' && html[end + 1] === '"') break;
                end++;
              }
              const extracted = cleanEscapedUrl(html.slice(start, end));
              if (extracted && extracted.includes('fbcdn.net')) {
                downloadUrl = extracted;
              }
            }
          }

          // Robust extraction of display_url (thumbnail)
          const dIdx = html.indexOf('display_url');
          if (dIdx !== -1) {
            const start = html.indexOf('http', dIdx);
            if (start !== -1 && start - dIdx < 25) {
              let end = start;
              while (end < html.length) {
                if (html[end] === '"' && html[end - 1] !== '\\') break;
                if (html[end] === '\\' && html[end + 1] === '"') break;
                end++;
              }
              const extractedImg = cleanEscapedUrl(html.slice(start, end));
              if (extractedImg) {
                previewData.thumbnail = extractedImg;
              }
            }
          }
        }
      } catch (err) {
        logger.warn('Instagram embed extraction fallback', { error: err.message });
      }
    }

    if (downloadUrl) {
      downloadAvailable = true;
    } else {
      downloadAvailable = false;
      message = "Direct video stream isn't available for this Instagram content without platform authentication. You can open the original video on Instagram or configure an API key in .env.";
    }

    const options = [
      {
        label: 'Preview Cover (JPG)',
        url: `/api/download?url=${encodeURIComponent(`https://www.instagram.com/p/${mediaId}/media/?size=l`)}&filename=instagram_${mediaId}.jpg`,
        type: 'image',
        quality: 'High'
      }
    ];

    if (downloadAvailable && downloadUrl) {
      options.unshift({
        label: 'High Quality MP4',
        url: `/api/download?url=${encodeURIComponent(downloadUrl)}&filename=instagram_${mediaId}.mp4`,
        type: 'video',
        quality: 'HD'
      });
    }

    return {
      downloadAvailable,
      downloadUrl: downloadAvailable ? `/api/download?url=${encodeURIComponent(downloadUrl)}&filename=instagram_${mediaId}.mp4` : null,
      options,
      message
    };
  }
}

module.exports = InstagramPlatform;
