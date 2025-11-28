import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from '../app.js';

describe('GET /health', () => {
  it('returns ok status and timestamp', async () => {
    const res = await request(app).get('/health').expect(200);
    expect(res.body).toHaveProperty('status', 'ok');
    expect(typeof res.body.timestamp).toBe('string');
  });
});
