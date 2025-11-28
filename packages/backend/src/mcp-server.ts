import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { loadMovies, getMovieById } from './services/movieService.js';
import * as z from 'zod/v4-mini';

// Create and configure the MCP server
export function createMCPServer() {
  const server = new McpServer({
    name: 'nodefun-movie-api',
    version: '0.1.0',
  });

  // Register get_movie tool
  server.registerTool(
    'get_movie',
    {
      title: 'Get Movie',
      description: 'Get a movie by its ID',
      inputSchema: z.object({ id: z.number() }),
    },
    async ({ id }) => {
      const movie = getMovieById(id);

      if (!movie) {
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({ error: 'Movie not found' }, null, 2),
            },
          ],
        };
      }

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(movie, null, 2),
          },
        ],
        structuredContent: movie,
      };
    }
  );

  // Register search_movies tool
  server.registerTool(
    'search_movies',
    {
      title: 'Search Movies',
      description: 'Search for movies by title, genre, or other criteria',
      inputSchema: z.object({
        query: z.optional(z.string()),
        genre: z.optional(z.string()),
        minRating: z.optional(z.number()),
        maxResults: z.optional(z.number()),
      }),
    },
    async ({ query, genre, minRating, maxResults = 10 }) => {
      let movies = loadMovies();

      // Filter by query (case-insensitive title search)
      if (query) {
        const lowerQuery = query.toLowerCase();
        movies = movies.filter((movie) =>
          movie.title.toLowerCase().includes(lowerQuery)
        );
      }

      // Filter by genre
      if (genre) {
        const lowerGenre = genre.toLowerCase();
        movies = movies.filter((movie) =>
          movie.genre.toLowerCase().includes(lowerGenre)
        );
      }

      // Filter by minimum rating
      if (minRating !== undefined) {
        movies = movies.filter((movie) => movie.rating >= minRating);
      }

      // Limit results
      const results = movies.slice(0, maxResults);

      const output = {
        total: movies.length,
        returned: results.length,
        movies: results,
      };

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(output, null, 2),
          },
        ],
        structuredContent: output,
      };
    }
  );

  // Register list_movies tool
  server.registerTool(
    'list_movies',
    {
      title: 'List Movies',
      description: 'List all available movies with optional pagination',
      inputSchema: z.object({
        limit: z.optional(z.number()),
        offset: z.optional(z.number()),
      }),
    },
    async ({ limit = 20, offset = 0 }) => {
      const movies = loadMovies();
      const paginatedMovies = movies.slice(offset, offset + limit);

      const output = {
        total: movies.length,
        returned: paginatedMovies.length,
        offset,
        limit,
        movies: paginatedMovies,
      };

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(output, null, 2),
          },
        ],
        structuredContent: output,
      };
    }
  );

  // Register get_movie_stats tool
  server.registerTool(
    'get_movie_stats',
    {
      title: 'Get Movie Stats',
      description: 'Get statistics about the movie database',
      inputSchema: z.object({}),
    },
    async () => {
      const movies = loadMovies();

      // Calculate statistics
      const genres = new Set(movies.map((m) => m.genre));
      const totalBudget = movies.reduce((sum, m) => sum + m.budget, 0);
      const totalGross = movies.reduce((sum, m) => sum + m.gross, 0);
      const avgRating =
        movies.reduce((sum, m) => sum + m.rating, 0) / movies.length;
      const avgRuntime =
        movies.reduce((sum, m) => sum + m.runtime, 0) / movies.length;

      const stats = {
        totalMovies: movies.length,
        uniqueGenres: genres.size,
        genres: Array.from(genres).sort(),
        totalBudget,
        totalGross,
        averageRating: parseFloat(avgRating.toFixed(2)),
        averageRuntime: parseFloat(avgRuntime.toFixed(2)),
      };

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(stats, null, 2),
          },
        ],
        structuredContent: stats,
      };
    }
  );

  return server;
}
