import type { Request, Response } from 'express';
import express from 'express';
import type { HealthStatus } from './types/health.js';
import { getMovieById } from './services/movieService.js';

export const app = express();

app.get('/', (_req: Request, res: Response) => {
  res.send('Hello World!');
});

app.get('/health', (_req: Request, res: Response) => {
  const payload: HealthStatus = { status: 'ok', timestamp: new Date().toISOString() };
  res.json(payload);
});

app.get('/movies/:id', (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  
  if (isNaN(id)) {
    res.status(400).json({ error: 'Invalid movie ID' });
    return;
  }
  
  const movie = getMovieById(id);
  
  if (!movie) {
    res.status(404).json({ error: 'Movie not found' });
    return;
  }
  
  res.json(movie);
});
