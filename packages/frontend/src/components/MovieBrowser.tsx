import { useState, useEffect, useCallback } from 'react';
import { movieApi } from '../services/movieApi';
import { Movie } from '../types/movie';
import { MovieCard } from './MovieCard';
import { SearchBar } from './SearchBar';
import './MovieBrowser.css';

export function MovieBrowser() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [minRating, setMinRating] = useState<number | undefined>();

  const loadMovies = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (searchQuery || selectedGenre || minRating) {
        const results = await movieApi.searchMovies({
          query: searchQuery || undefined,
          genre: selectedGenre || undefined,
          minRating: minRating,
          maxResults: 50
        });
        setMovies(results);
      } else {
        const results = await movieApi.listMovies(50, 0);
        setMovies(results);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [searchQuery, selectedGenre, minRating]);

  useEffect(() => {
    loadMovies();
  }, [loadMovies]);

  return (
    <div className="movie-browser">
      <header className="browser-header">
        <h1>🎬 NodeFun Movie Browser</h1>
        <p>Explore our collection of amazing movies</p>
      </header>

      <SearchBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedGenre={selectedGenre}
        onGenreChange={setSelectedGenre}
        minRating={minRating}
        onRatingChange={setMinRating}
      />

      {error && (
        <div className="error-message">
          ❌ {error}
        </div>
      )}

      {loading ? (
        <div className="loading">Loading movies...</div>
      ) : (
        <>
          <div className="results-count">
            Found {movies.length} movie{movies.length !== 1 ? 's' : ''}
          </div>
          <div className="movie-grid">
            {movies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        </>
      )}

      {!loading && movies.length === 0 && !error && (
        <div className="no-results">
          No movies found. Try adjusting your search filters.
        </div>
      )}
    </div>
  );
}
