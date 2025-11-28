import { Movie, MovieStats } from '../types/movie';

const API_BASE = '/api';

export const movieApi = {
  async getMovie(id: number): Promise<Movie> {
    const response = await fetch(`${API_BASE}/movies/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch movie');
    }
    return response.json();
  },

  async searchMovies(params: {
    query?: string;
    genre?: string;
    minRating?: number;
    maxResults?: number;
  }): Promise<Movie[]> {
    const searchParams = new URLSearchParams();
    if (params.query) searchParams.append('query', params.query);
    if (params.genre) searchParams.append('genre', params.genre);
    if (params.minRating) searchParams.append('minRating', params.minRating.toString());
    if (params.maxResults) searchParams.append('maxResults', params.maxResults.toString());

    const response = await fetch(`${API_BASE}/movies/search?${searchParams}`);
    if (!response.ok) {
      throw new Error('Failed to search movies');
    }
    return response.json();
  },

  async listMovies(limit = 20, offset = 0): Promise<Movie[]> {
    const response = await fetch(`${API_BASE}/movies?limit=${limit}&offset=${offset}`);
    if (!response.ok) {
      throw new Error('Failed to list movies');
    }
    return response.json();
  },

  async getStats(): Promise<MovieStats> {
    const response = await fetch(`${API_BASE}/movies/stats`);
    if (!response.ok) {
      throw new Error('Failed to fetch stats');
    }
    return response.json();
  }
};
