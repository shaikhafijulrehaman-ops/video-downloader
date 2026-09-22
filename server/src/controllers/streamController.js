const logger = require('../utils/logger');
const { validateSafeUrl } = require('../middleware/ssrfGuard');

// Additional safe CDN host patterns for media streaming
const SAFE_MEDIA_CDN_DOMAINS = [
  'ytimg.com',
  'i.ytimg.com',
  'googlevideo.com',
  'instagram.com',
  'cdninstagram.com',
  'fbcdn.net',
  'facebook.com'
];

function isAllowedMediaHost(hostname) {
  return SAFE_MEDIA_CDN_DOMAINS.some(allowed => 
    hostname === allowed || hostname.endsWith(`.${allowed}`)
  );
}

/**
 * Controller to securely stream allowed media files with Content-Disposition
 * GET /api/download?url=...&filename=...
 */
async function streamMedia(req, res, next) {
  const { url: targetUrl, filename = 'download.jpg' } = req.query;

  if (!targetUrl) {
    return res.status(400).json({ success: false, error: 'Target URL is required.' });
  }

  let parsedUrl;
  try {
    parsedUrl = new URL(targetUrl);
  } catch (e) {
    return res.status(400).json({ success: false, error: 'Invalid media URL.' });
  }

  // Security check: Must be HTTP/HTTPS and from allowed media CDN
  if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
    return res.status(400).json({ success: false, error: 'Invalid URL protocol.' });
  }

  const hostname = parsedUrl.hostname.toLowerCase();
  if (!isAllowedMediaHost(hostname)) {
    return res.status(403).json({ success: false, error: 'Host is not permitted for media download.' });
  }

  // Sanitize filename to prevent header injection or directory traversal
  const safeFilename = filename.replace(/[^a-zA-Z0-9_.-]/g, '_').slice(0, 100);

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000);

    const response = await fetch(parsedUrl.toString(), {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
        'Accept': '*/*',
        'Accept-Language': 'en-US,en;q=0.9',
        'Referer': 'https://www.instagram.com/'
      }
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      return res.status(response.status).json({
        success: false,
        error: 'Unable to retrieve media from upstream provider.'
      });
    }

    const contentType = response.headers.get('content-type') || 'application/octet-stream';
    const contentLength = response.headers.get('content-length');

    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', `attachment; filename="${safeFilename}"`);
    if (contentLength) {
      res.setHeader('Content-Length', contentLength);
    }
    // Prevent client caching of dynamic media
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');

    // Convert web ReadableStream to Node response pipe
    const reader = response.body.getReader();

    async function pump() {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        res.write(value);
      }
      res.end();
    }

    await pump();

  } catch (err) {
    logger.error('Stream error:', { error: err.message });
    if (!res.headersSent) {
      return res.status(500).json({
        success: false,
        error: 'Failed to stream media. Please try again.'
      });
    }
  }
}

module.exports = { streamMedia };
