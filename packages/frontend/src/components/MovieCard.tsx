import { Movie } from '../types/movie';
import './MovieCard.css';

interface MovieCardProps {
  movie: Movie;
}

export function MovieCard({ movie }: MovieCardProps) {
  const year = movie.releaseDate ? new Date(movie.releaseDate).getFullYear() : 'N/A';
  
  return (
    <div className="movie-card">
      <div className="movie-header">
        <h3 className="movie-title">{movie.title}</h3>
        <span className="movie-year">{year}</span>
      </div>
      
      <div className="movie-info">
        <div className="info-row">
          <span className="label">Genre:</span>
          <span className="value">{movie.genre}</span>
        </div>
        <div className="info-row">
          <span className="label">Rating:</span>
          <span className="value">{movie.mpaaRating}</span>
        </div>
        <div className="info-row">
          <span className="label">Runtime:</span>
          <span className="value">{movie.runtime} min</span>
        </div>
      </div>

      <div className="movie-stats">
        <div className="stat">
          <span className="stat-label">⭐ Rating</span>
          <span className="stat-value">{movie.rating.toFixed(1)}</span>
        </div>
        <div className="stat">
          <span className="stat-label">👥 Votes</span>
          <span className="stat-value">{movie.ratingCount.toLocaleString()}</span>
        </div>
        <div className="stat">
          <span className="stat-label">💰 Budget</span>
          <span className="stat-value">${(movie.budget / 1000000).toFixed(1)}M</span>
        </div>
      </div>

      {movie.gross > 0 && (
        <div className="movie-revenue">
          💵 Gross: ${(movie.gross / 1000000).toFixed(1)}M
        </div>
      )}
      
      {movie.summary && (
        <div className="movie-summary">
          {movie.summary.length > 150 ? `${movie.summary.substring(0, 150)}...` : movie.summary}
        </div>
      )}
    </div>
  );
}
