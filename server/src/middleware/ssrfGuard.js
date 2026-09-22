/**
 * SSRF and Hostname Protection Middleware & Validator
 * Strictly validates URLs and prevents access to internal/private networks
 */

// Permitted top-level/sub-domain suffixes for supported video platforms
const ALLOWED_PLATFORM_DOMAINS = [
  'youtube.com',
  'youtu.be',
  'instagram.com',
  'facebook.com',
  'fb.watch'
];

// Private and reserved IP patterns
const PRIVATE_IP_PATTERNS = [
  /^localhost$/i,
  /^127\./,                          // 127.0.0.0/8 (Loopback)
  /^10\./,                           // 10.0.0.0/8 (Private)
  /^192\.168\./,                     // 192.168.0.0/16 (Private)
  /^172\.(1[6-9]|2[0-9]|3[0-1])\./,  // 172.16.0.0/12 (Private)
  /^169\.254\./,                     // 169.254.0.0/16 (Link-local / Cloud metadata)
  /^0\.0\.0\.0$/,                    // Any IPv4
  /^::1$/,                           // IPv6 loopback
  /^fe80:/i,                         // IPv6 link-local
  /^fc00:/i,                         // IPv6 unique local
  /\.internal$/i,
  /\.local$/i
];

/**
 * Validates a target URL against SSRF rules and domain allowlist
 * @param {string} rawUrl 
 * @returns {{ valid: boolean, error?: string, parsedUrl?: URL }}
 */
function validateSafeUrl(rawUrl) {
  if (!rawUrl || typeof rawUrl !== 'string') {
    return { valid: false, error: 'Please enter a valid video URL.' };
  }

  const trimmed = rawUrl.trim();
  if (trimmed.length > 2048) {
    return { valid: false, error: 'URL is too long.' };
  }

  // If a protocol scheme is present but is not http or https, reject immediately
  if (/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(trimmed) && !/^https?:\/\//i.test(trimmed)) {
    return { valid: false, error: 'Only HTTP and HTTPS URLs are permitted.' };
  }

  let parsedUrl;
  try {
    const urlToParse = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
    parsedUrl = new URL(urlToParse);
  } catch (err) {
    return { valid: false, error: 'Please enter a valid video URL.' };
  }

  // Enforce HTTP / HTTPS only
  if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
    return { valid: false, error: 'Only HTTP and HTTPS URLs are permitted.' };
  }

  const hostname = parsedUrl.hostname.toLowerCase();

  // Check against private/loopback patterns
  for (const pattern of PRIVATE_IP_PATTERNS) {
    if (pattern.test(hostname)) {
      return { valid: false, error: 'Access to private or local network resources is restricted.' };
    }
  }

  // Check if hostname is an allowed social platform domain
  const isAllowedDomain = ALLOWED_PLATFORM_DOMAINS.some(allowed => 
    hostname === allowed || hostname.endsWith(`.${allowed}`)
  );

  if (!isAllowedDomain) {
    return { 
      valid: false, 
      error: 'This platform isn\'t supported yet. We currently support YouTube, Instagram, and Facebook.' 
    };
  }

  return { valid: true, parsedUrl };
}

/**
 * Express middleware to validate request body URL
 */
function ssrfGuardMiddleware(req, res, next) {
  const { url } = req.body || {};
  const validation = validateSafeUrl(url);

  if (!validation.valid) {
    return res.status(400).json({
      success: false,
      error: validation.error
    });
  }

  // Attach sanitized parsed URL object to request for downstream handlers
  req.safeUrl = validation.parsedUrl;
  next();
}

module.exports = {
  validateSafeUrl,
  ssrfGuardMiddleware,
  ALLOWED_PLATFORM_DOMAINS
};
