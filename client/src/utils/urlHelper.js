/**
 * Client-Side URL Utilities and Platform Detection
 */

export const SUPPORTED_PLATFORMS = {
  YOUTUBE: 'youtube',
  INSTAGRAM: 'instagram',
  FACEBOOK: 'facebook'
};

export const PLATFORM_INFO = {
  youtube: {
    id: 'youtube',
    name: 'YouTube',
    tagline: 'Videos & Shorts',
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    badgeClass: 'bg-red-50 text-red-700 border-red-200'
  },
  instagram: {
    id: 'instagram',
    name: 'Instagram',
    tagline: 'Reels, Posts & Videos',
    color: 'text-pink-600',
    bgColor: 'bg-pink-50',
    borderColor: 'border-pink-200',
    badgeClass: 'bg-gradient-to-r from-purple-50 via-pink-50 to-amber-50 text-pink-700 border-pink-200'
  },
  facebook: {
    id: 'facebook',
    name: 'Facebook',
    tagline: 'Videos & Reels',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    badgeClass: 'bg-blue-50 text-blue-700 border-blue-200'
  }
};

/**
 * Rapid client-side platform detector for UI reactive state
 * @param {string} rawUrl
 * @returns {string|null} platform key ('youtube' | 'instagram' | 'facebook' | null)
 */
export function detectPlatformClient(rawUrl) {
  if (!rawUrl || typeof rawUrl !== 'string') return null;
  const trimmed = rawUrl.trim().toLowerCase();

  if (trimmed.includes('youtube.com') || trimmed.includes('youtu.be')) {
    return SUPPORTED_PLATFORMS.YOUTUBE;
  }
  if (trimmed.includes('instagram.com')) {
    return SUPPORTED_PLATFORMS.INSTAGRAM;
  }
  if (trimmed.includes('facebook.com') || trimmed.includes('fb.watch')) {
    return SUPPORTED_PLATFORMS.FACEBOOK;
  }
  return null;
}

/**
 * Validates URL format and supported domains client-side before sending to server
 * @param {string} rawUrl
 * @returns {{ valid: boolean, error?: string, platform?: string }}
 */
export function validateUrlClient(rawUrl) {
  if (!rawUrl || !rawUrl.trim()) {
    return { valid: false, error: 'Please enter a valid video URL.' };
  }

  const trimmed = rawUrl.trim();

  // Basic URL syntax check
  let parsedUrl;
  try {
    const urlToParse = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
    parsedUrl = new URL(urlToParse);
  } catch (e) {
    return { valid: false, error: 'Please enter a valid video URL.' };
  }

  const host = parsedUrl.hostname.toLowerCase();

  // Internal/localhost guard
  if (host === 'localhost' || host === '127.0.0.1' || host.startsWith('192.168.') || host.startsWith('10.')) {
    return { valid: false, error: 'Private or restricted content cannot be processed.' };
  }

  const platform = detectPlatformClient(trimmed);
  if (!platform) {
    return { valid: false, error: 'That platform is not supported yet. We support YouTube, Instagram, and Facebook.' };
  }

  // Platform-specific content checks
  if (platform === SUPPORTED_PLATFORMS.YOUTUBE) {
    const p = parsedUrl.pathname;
    const v = parsedUrl.searchParams.get('v');
    const isYoutuBe = host.includes('youtu.be');
    const isWatch = p.startsWith('/watch') && v;
    const isShorts = p.startsWith('/shorts/');
    const isEmbed = p.startsWith('/embed/');

    if (!isYoutuBe && !isWatch && !isShorts && !isEmbed) {
      return { valid: false, error: 'Please enter a link to a specific YouTube video or Short.' };
    }
  }

  if (platform === SUPPORTED_PLATFORMS.INSTAGRAM) {
    const p = parsedUrl.pathname;
    const isValidPath = p.includes('/reel/') || p.includes('/reels/') || p.includes('/p/') || p.includes('/tv/');
    if (!isValidPath) {
      return { valid: false, error: 'Please enter a link to an Instagram Reel, Video, or Post.' };
    }
  }

  if (platform === SUPPORTED_PLATFORMS.FACEBOOK) {
    const p = parsedUrl.pathname;
    const v = parsedUrl.searchParams.get('v');
    const isWatch = p.includes('/watch') && v;
    const isReel = p.includes('/reel/');
    const isVideos = p.includes('/videos/');
    const isFbWatch = host.includes('fb.watch');

    if (!isWatch && !isReel && !isVideos && !isFbWatch) {
      return { valid: false, error: 'Please enter a link to a specific Facebook video or reel.' };
    }
  }

  return { valid: true, platform };
}
