import type { Request, Response } from 'express';
import express from 'express';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import type { HealthStatus } from './types/health.js';
import { getMovieById, searchMovies, listMovies, getMovieStats } from './services/movieService.js';
import { createMCPServer } from './mcp-server.js';

export const app = express();

app.use(express.json());

// Create MCP server instance
const mcpServer = createMCPServer();

app.get('/', (_req: Request, res: Response) => {
  res.send('Hello World!');
});

app.get('/health', (_req: Request, res: Response) => {
  const payload: HealthStatus = { status: 'ok', timestamp: new Date().toISOString() };
  res.json(payload);
});

// MCP endpoint for Model Context Protocol
app.post('/mcp', async (req: Request, res: Response) => {
  // Create a new transport for each request to prevent request ID collisions
  const transport = new StreamableHTTPServerTransport({
    sessionIdGenerator: undefined,
    enableJsonResponse: true,
  });

  res.on('close', () => {
    transport.close();
  });

  await mcpServer.connect(transport);
  await transport.handleRequest(req, res, req.body);
});

// Movie API endpoints - specific routes before parameterized routes
app.get('/movies/search', (req: Request, res: Response) => {
  const { query, genre, minRating, maxResults } = req.query;
  
  const results = searchMovies({
    query: query as string | undefined,
    genre: genre as string | undefined,
    minRating: minRating ? parseFloat(minRating as string) : undefined,
    maxResults: maxResults ? parseInt(maxResults as string, 10) : undefined
  });
  
  res.json(results);
});

app.get('/movies/stats', (_req: Request, res: Response) => {
  const stats = getMovieStats();
  res.json(stats);
});

app.get('/movies', (req: Request, res: Response) => {
  const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 20;
  const offset = req.query.offset ? parseInt(req.query.offset as string, 10) : 0;
  
  const results = listMovies(limit, offset);
  res.json(results);
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
