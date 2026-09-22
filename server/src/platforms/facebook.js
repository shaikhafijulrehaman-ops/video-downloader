const BasePlatform = require('./BasePlatform');
const logger = require('../utils/logger');

class FacebookPlatform extends BasePlatform {
  constructor() {
    super('facebook', 'Facebook');
  }

  detect(parsedUrl) {
    const host = parsedUrl.hostname.toLowerCase();
    return host === 'facebook.com' ||
           host.endsWith('.facebook.com') ||
           host === 'fb.watch' ||
           host.endsWith('.fb.watch');
  }

  validate(parsedUrl) {
    const host = parsedUrl.hostname.toLowerCase();
    const pathname = parsedUrl.pathname;
    let videoId = null;
    let mediaType = 'Facebook Video';

    if (host.includes('fb.watch')) {
      const parts = pathname.split('/').filter(Boolean);
      if (parts.length > 0) {
        videoId = parts[0];
      }
    } else if (pathname.includes('/reel/')) {
      const match = pathname.match(/\/reel\/([0-9a-zA-Z_-]+)/i);
      if (match) {
        videoId = match[1];
        mediaType = 'Facebook Reel';
      }
    } else if (pathname.includes('/watch')) {
      videoId = parsedUrl.searchParams.get('v');
    } else if (pathname.includes('/videos/')) {
      const match = pathname.match(/\/videos\/([0-9]+)/i);
      if (match) {
        videoId = match[1];
      }
    }

    if (!videoId) {
      return {
        valid: false,
        error: 'Please enter a valid Facebook video, reel, or watch URL.'
      };
    }

    const normalizedUrl = `https://www.facebook.com/watch/?v=${videoId}`;

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
    let author = 'Facebook User';
    let authorUrl = 'https://www.facebook.com';
    let thumbnail = 'https://static.xx.fbcdn.net/rsrc.php/v3/y2/r/m1n1w_m1n1w.png';

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
    return {
      downloadAvailable: false,
      message: "Direct download isn't available for this Facebook video due to platform access controls. You can open the original video on Facebook.",
      options: []
    };
  }
}

module.exports = FacebookPlatform;
