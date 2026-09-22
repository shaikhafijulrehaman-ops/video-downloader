const { validateSafeUrl } = require('../src/middleware/ssrfGuard');

describe('SSRF and Safe URL Guard', () => {
  test('permits valid YouTube URL', () => {
    const res = validateSafeUrl('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
    expect(res.valid).toBe(true);
    expect(res.parsedUrl).toBeDefined();
  });

  test('permits valid Instagram URL', () => {
    const res = validateSafeUrl('https://www.instagram.com/reel/C8k_jR9PABC/');
    expect(res.valid).toBe(true);
  });

  test('permits valid Facebook URL', () => {
    const res = validateSafeUrl('https://www.facebook.com/watch/?v=123456');
    expect(res.valid).toBe(true);
  });

  test('blocks localhost SSRF attempts', () => {
    const res = validateSafeUrl('http://localhost:3000/admin');
    expect(res.valid).toBe(false);
    expect(res.error).toContain('private or local network');
  });

  test('blocks 127.0.0.1 loopback', () => {
    const res = validateSafeUrl('http://127.0.0.1:8080/secret');
    expect(res.valid).toBe(false);
  });

  test('blocks 10.x private network IP', () => {
    const res = validateSafeUrl('http://10.0.0.1/config');
    expect(res.valid).toBe(false);
  });

  test('blocks 192.168.x private network IP', () => {
    const res = validateSafeUrl('http://192.168.1.1/router');
    expect(res.valid).toBe(false);
  });

  test('blocks AWS/GCP metadata IP 169.254.169.254', () => {
    const res = validateSafeUrl('http://169.254.169.254/latest/meta-data/');
    expect(res.valid).toBe(false);
  });

  test('blocks file:// protocol', () => {
    const res = validateSafeUrl('file:///etc/passwd');
    expect(res.valid).toBe(false);
    expect(res.error).toContain('Only HTTP and HTTPS');
  });

  test('blocks unsupported random external domain', () => {
    const res = validateSafeUrl('https://attacker-domain.xyz/payload');
    expect(res.valid).toBe(false);
    expect(res.error).toContain("platform isn't supported yet");
  });

  test('rejects empty or whitespace input', () => {
    expect(validateSafeUrl('').valid).toBe(false);
    expect(validateSafeUrl('   ').valid).toBe(false);
    expect(validateSafeUrl(null).valid).toBe(false);
  });
});
