const { resolvePlatform } = require('../src/platforms');
const YouTubePlatform = require('../src/platforms/youtube');
const InstagramPlatform = require('../src/platforms/instagram');
const FacebookPlatform = require('../src/platforms/facebook');

describe('Platform Detection and Validation', () => {
  const yt = new YouTubePlatform();
  const ig = new InstagramPlatform();
  const fb = new FacebookPlatform();

  describe('YouTube Platform', () => {
    test('detects standard watch URL', () => {
      const url = new URL('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
      expect(yt.detect(url)).toBe(true);
      const val = yt.validate(url);
      expect(val.valid).toBe(true);
      expect(val.mediaId).toBe('dQw4w9WgXcQ');
      expect(val.mediaType).toBe('Video');
    });

    test('detects YouTube Shorts URL', () => {
      const url = new URL('https://www.youtube.com/shorts/dQw4w9WgXcQ');
      expect(yt.detect(url)).toBe(true);
      const val = yt.validate(url);
      expect(val.valid).toBe(true);
      expect(val.mediaId).toBe('dQw4w9WgXcQ');
      expect(val.mediaType).toBe('YouTube Short');
      expect(val.normalizedUrl).toContain('/shorts/dQw4w9WgXcQ');
    });

    test('detects youtu.be short link', () => {
      const url = new URL('https://youtu.be/dQw4w9WgXcQ');
      expect(yt.detect(url)).toBe(true);
      const val = yt.validate(url);
      expect(val.valid).toBe(true);
      expect(val.mediaId).toBe('dQw4w9WgXcQ');
    });

    test('rejects invalid YouTube video ID', () => {
      const url = new URL('https://www.youtube.com/watch?v=short');
      const val = yt.validate(url);
      expect(val.valid).toBe(false);
      expect(val.error).toBeDefined();
    });
  });

  describe('Instagram Platform', () => {
    test('detects Instagram Reel URL', () => {
      const url = new URL('https://www.instagram.com/reel/C8k_jR9PABC/');
      expect(ig.detect(url)).toBe(true);
      const val = ig.validate(url);
      expect(val.valid).toBe(true);
      expect(val.mediaId).toBe('C8k_jR9PABC');
      expect(val.mediaType).toBe('Instagram Reel');
    });

    test('detects Instagram Post URL', () => {
      const url = new URL('https://www.instagram.com/p/DFxyz123abc/');
      expect(ig.detect(url)).toBe(true);
      const val = ig.validate(url);
      expect(val.valid).toBe(true);
      expect(val.mediaId).toBe('DFxyz123abc');
      expect(val.mediaType).toBe('Instagram Post');
    });

    test('rejects Instagram profile URL without media', () => {
      const url = new URL('https://www.instagram.com/someone/');
      const val = ig.validate(url);
      expect(val.valid).toBe(false);
    });
  });

  describe('Facebook Platform', () => {
    test('detects Facebook Watch URL', () => {
      const url = new URL('https://www.facebook.com/watch/?v=123456789012345');
      expect(fb.detect(url)).toBe(true);
      const val = fb.validate(url);
      expect(val.valid).toBe(true);
      expect(val.mediaId).toBe('123456789012345');
    });

    test('detects Facebook Reel URL', () => {
      const url = new URL('https://www.facebook.com/reel/987654321098765');
      expect(fb.detect(url)).toBe(true);
      const val = fb.validate(url);
      expect(val.valid).toBe(true);
      expect(val.mediaId).toBe('987654321098765');
      expect(val.mediaType).toBe('Facebook Reel');
    });

    test('detects fb.watch URL', () => {
      const url = new URL('https://fb.watch/abCdEf123/');
      expect(fb.detect(url)).toBe(true);
      const val = fb.validate(url);
      expect(val.valid).toBe(true);
      expect(val.mediaId).toBe('abCdEf123');
    });
  });

  describe('Platform Resolver Registry', () => {
    test('resolves correct platform instance', () => {
      expect(resolvePlatform(new URL('https://www.youtube.com/watch?v=dQw4w9WgXcQ'))).toBeInstanceOf(YouTubePlatform);
      expect(resolvePlatform(new URL('https://www.instagram.com/reel/abc123xyz/'))).toBeInstanceOf(InstagramPlatform);
      expect(resolvePlatform(new URL('https://www.facebook.com/reel/123/'))).toBeInstanceOf(FacebookPlatform);
      expect(resolvePlatform(new URL('https://twitter.com/test'))).toBeNull();
    });
  });
});
