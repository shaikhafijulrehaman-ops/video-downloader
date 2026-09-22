const request = require('supertest');
const app = require('../src/app');

describe('API Integration Tests', () => {
  describe('GET /api/health', () => {
    test('returns health status', async () => {
      const res = await request(app).get('/api/health');
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('ok');
    });
  });

  describe('GET /api/platforms', () => {
    test('returns supported platforms list', async () => {
      const res = await request(app).get('/api/platforms');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.platforms)).toBe(true);
      expect(res.body.platforms.map(p => p.id)).toEqual(
        expect.arrayContaining(['youtube', 'instagram', 'facebook'])
      );
    });
  });

  describe('POST /api/process', () => {
    test('rejects missing or empty URL', async () => {
      const res = await request(app)
        .post('/api/process')
        .send({});
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toBeDefined();
    });

    test('rejects SSRF localhost attempt', async () => {
      const res = await request(app)
        .post('/api/process')
        .send({ url: 'http://localhost:3000/internal' });
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toContain('private or local network');
    });

    test('rejects unsupported domain', async () => {
      const res = await request(app)
        .post('/api/process')
        .send({ url: 'https://vimeo.com/12345678' });
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toContain("platform isn't supported yet");
    });

    test('validates valid YouTube video structure', async () => {
      const res = await request(app)
        .post('/api/process')
        .send({ url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' });
      
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.platform).toBe('youtube');
      expect(res.body.mediaId).toBe('dQw4w9WgXcQ');
      expect(res.body.thumbnail).toBeDefined();
      expect(res.body.originalUrl).toContain('dQw4w9WgXcQ');
    });

    test('handles YouTube Shorts', async () => {
      const res = await request(app)
        .post('/api/process')
        .send({ url: 'https://www.youtube.com/shorts/dQw4w9WgXcQ' });
      
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.platform).toBe('youtube');
      expect(res.body.mediaType).toBe('YouTube Short');
    });

    test('handles Instagram Reel structure', async () => {
      const res = await request(app)
        .post('/api/process')
        .send({ url: 'https://www.instagram.com/reel/C8k_jR9PABC/' });
      
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.platform).toBe('instagram');
      expect(res.body.mediaId).toBe('C8k_jR9PABC');
      expect(res.body.originalUrl).toContain('C8k_jR9PABC');
    });

    test('handles Facebook Video structure', async () => {
      const res = await request(app)
        .post('/api/process')
        .send({ url: 'https://www.facebook.com/watch/?v=123456789012345' });
      
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.platform).toBe('facebook');
      expect(res.body.mediaId).toBe('123456789012345');
    });
  });

  describe('Security & Error Sanitization', () => {
    test('404 for unknown route returns clean JSON without stack trace', async () => {
      const res = await request(app).get('/api/nonexistent-endpoint');
      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.error).toBe('Endpoint not found.');
      expect(res.body.stack).toBeUndefined();
    });
  });
});
