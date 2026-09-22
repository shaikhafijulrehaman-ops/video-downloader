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
    let videoUrl = null;

    // Helper to unescape JSON URLs
    const cleanEscapedUrl = (raw) => {
      if (!raw) return null;
      return raw
        .replace(/\\\\\//g, '/')
        .replace(/\\\//g, '/')
        .replace(/\\u0026/g, '&')
        .replace(/\\u0025/g, '%');
    };

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

        // 1. Extract video_url
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
              videoUrl = extracted;
            }
          }
        }

        // 2. Extract display_url (cover image)
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
              thumbnail = extractedImg;
            }
          }
        }

        // 3. Extract username
        const userMatch = html.match(/"username":"([^"]+)"/i) || html.match(/username\\":\\"([^\\"]+)\\"/i);
        if (userMatch && userMatch[1]) {
          author = `@${userMatch[1]}`;
          authorUrl = `https://www.instagram.com/${userMatch[1]}/`;
        }
      }
    } catch (err) {
      logger.warn('Instagram embed extraction error', { error: err.message });
    }

    // Fallback thumbnail if display_url wasn't extracted
    if (!thumbnail) {
      thumbnail = `https://www.instagram.com/p/${mediaId}/media/?size=l`;
    }

    // Attach pre-resolved videoUrl to validationInfo cache to avoid double-fetching
    validationInfo.cachedVideoUrl = videoUrl;

    return {
      platform: this.name,
      platformLabel: this.label,
      mediaType,
      mediaId,
      title,
      author,
      authorUrl,
      thumbnail,
      originalUrl: normalizedUrl
    };
  }

  async getDownloadInfo(normalizedUrl, validationInfo, previewData) {
    const { mediaId, cachedVideoUrl } = validationInfo;
    let downloadUrl = cachedVideoUrl || null;
    let downloadAvailable = Boolean(downloadUrl);
    let message = null;

    // Check optional RapidAPI if not already resolved
    const apiKey = process.env.RAPIDAPI_KEY || process.env.INSTAGRAM_API_KEY;
    const apiHost = process.env.RAPIDAPI_HOST || 'instagram-downloader-download-instagram-videos-stories.p.rapidapi.com';

    if (!downloadUrl && apiKey) {
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
          if (data.result && Array.isArray(data.result) && data.result.length > 0) {
            const videoItem = data.result.find(item => item.video || item.type?.includes('video') || item.url?.includes('.mp4')) || data.result[0];
            downloadUrl = videoItem.video || videoItem.url;
            if (videoItem.thumb && !previewData.thumbnail) {
              previewData.thumbnail = videoItem.thumb;
            }
          } else if (data.url && (data.url.includes('.mp4') || data.type === 'video')) {
            downloadUrl = data.url;
          }
        }
      } catch (err) {
        logger.warn('RapidAPI Instagram resolver error:', { error: err.message });
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
