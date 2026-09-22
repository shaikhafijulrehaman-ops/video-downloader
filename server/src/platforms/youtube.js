const BasePlatform = require('./BasePlatform');
const logger = require('../utils/logger');

class YouTubePlatform extends BasePlatform {
  constructor() {
    super('youtube', 'YouTube');
  }

  detect(parsedUrl) {
    const host = parsedUrl.hostname.toLowerCase();
    return host === 'youtube.com' || 
           host.endsWith('.youtube.com') || 
           host === 'youtu.be' ||
           host.endsWith('.youtu.be');
  }

  validate(parsedUrl) {
    const host = parsedUrl.hostname.toLowerCase();
    const pathname = parsedUrl.pathname;
    let videoId = null;
    let mediaType = 'Video';

    if (host.includes('youtu.be')) {
      // e.g. youtu.be/dQw4w9WgXcQ
      const parts = pathname.split('/').filter(Boolean);
      if (parts.length > 0) {
        videoId = parts[0];
      }
    } else if (pathname.startsWith('/shorts/')) {
      // e.g. youtube.com/shorts/dQw4w9WgXcQ
      const parts = pathname.split('/').filter(Boolean);
      if (parts.length >= 2) {
        videoId = parts[1];
        mediaType = 'YouTube Short';
      }
    } else if (pathname.startsWith('/watch')) {
      // e.g. youtube.com/watch?v=dQw4w9WgXcQ
      videoId = parsedUrl.searchParams.get('v');
    } else if (pathname.startsWith('/embed/')) {
      // e.g. youtube.com/embed/dQw4w9WgXcQ
      const parts = pathname.split('/').filter(Boolean);
      if (parts.length >= 2) {
        videoId = parts[1];
      }
    }

    // Clean videoId from any query parameters or trailing slashes
    if (videoId) {
      videoId = videoId.split('?')[0].split('&')[0].replace(/\/$/, '');
    }

    // YouTube IDs are typically 11 alphanumeric characters, dashes, or underscores
    const isValidId = videoId && /^[a-zA-Z0-9_-]{11}$/.test(videoId);

    if (!isValidId) {
      return {
        valid: false,
        error: 'Please enter a valid YouTube video or Short URL.'
      };
    }

    const normalizedUrl = mediaType === 'YouTube Short'
      ? `https://www.youtube.com/shorts/${videoId}`
      : `https://www.youtube.com/watch?v=${videoId}`;

    return {
      valid: true,
      mediaId: videoId,
      mediaType,
      normalizedUrl
    };
  }

  async getPreview(normalizedUrl, validationInfo) {
    const { mediaId, mediaType } = validationInfo;
    let title = `${mediaType} (${mediaId})`;
    let author = 'YouTube Creator';
    let authorUrl = 'https://www.youtube.com';
    let thumbnail = `https://i.ytimg.com/vi/${mediaId}/hqdefault.jpg`;

    try {
      // Fetch official YouTube oEmbed metadata with 6s timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);

      const oembedUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(normalizedUrl)}&format=json`;
      const response = await fetch(oembedUrl, {
        signal: controller.signal,
        headers: { 'User-Agent': 'DownloadHub-MetadataBot/1.0' }
      });
      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        title = data.title || title;
        author = data.author_name || author;
        authorUrl = data.author_url || authorUrl;
        if (data.thumbnail_url) {
          // Use high quality thumbnail if available
          thumbnail = `https://i.ytimg.com/vi/${mediaId}/maxresdefault.jpg`;
        }
      }
    } catch (err) {
      logger.warn('YouTube oEmbed metadata fetch failed or timed out, using fallback metadata', {
        error: err.message
      });
    }

    return {
      platform: this.name,
      platformLabel: this.label,
      mediaType,
      mediaId,
      title,
      author,
      authorUrl,
      thumbnail,
      thumbnailFallback: `https://i.ytimg.com/vi/${mediaId}/hqdefault.jpg`,
      originalUrl: normalizedUrl
    };
  }

  async getDownloadInfo(normalizedUrl, validationInfo, previewData) {
    const { mediaId, mediaType } = validationInfo;

    // YouTube strictly protects video streams under platform Terms of Service and DRM.
    // Per compliance rules: Do not bypass platform access controls.
    // We provide clean download of high-resolution thumbnail and official original video access.
    return {
      downloadAvailable: false,
      message: "Direct video stream download is restricted by YouTube's platform policies. You can view or save permitted media below.",
      options: [
        {
          label: 'HD Thumbnail (JPG)',
          url: `/api/download?url=${encodeURIComponent(`https://i.ytimg.com/vi/${mediaId}/hqdefault.jpg`)}&filename=youtube_${mediaId}_thumb.jpg`,
          type: 'image',
          quality: 'HD'
        }
      ]
    };
  }
}

module.exports = YouTubePlatform;
