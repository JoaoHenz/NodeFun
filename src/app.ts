import type { Request, Response } from 'express';
import express from 'express';
import type { HealthStatus } from './types/health.js';

export const app = express();

app.get('/', (_req: Request, res: Response) => {
  res.send('Hello World!');
});

app.get('/health', (_req: Request, res: Response) => {
  const payload: HealthStatus = { status: 'ok', timestamp: new Date().toISOString() };
  res.json(payload);
});
