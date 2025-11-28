import './SearchBar.css';

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedGenre: string;
  onGenreChange: (genre: string) => void;
  minRating: number | undefined;
  onRatingChange: (rating: number | undefined) => void;
}

const GENRES = [
  'All Genres',
  'Action',
  'Adventure',
  'Animation',
  'Biography',
  'Comedy',
  'Crime',
  'Drama',
  'Family',
  'Fantasy',
  'Horror',
  'Mystery',
  'Romance',
  'Sci-Fi',
  'Thriller',
  'Western'
];

export function SearchBar({
  searchQuery,
  onSearchChange,
  selectedGenre,
  onGenreChange,
  minRating,
  onRatingChange
}: SearchBarProps) {
  return (
    <div className="search-bar">
      <div className="search-input-group">
        <input
          type="text"
          placeholder="Search movies by title..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="filters">
        <div className="filter-group">
          <label htmlFor="genre-filter" className="filter-label">Genre:</label>
          <select
            id="genre-filter"
            value={selectedGenre}
            onChange={(e) => onGenreChange(e.target.value === 'All Genres' ? '' : e.target.value)}
            className="filter-select"
          >
            {GENRES.map((genre) => (
              <option key={genre} value={genre === 'All Genres' ? '' : genre}>
                {genre}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="rating-filter" className="filter-label">Min Rating:</label>
          <select
            id="rating-filter"
            value={minRating ?? ''}
            onChange={(e) => onRatingChange(e.target.value ? Number(e.target.value) : undefined)}
            className="filter-select"
          >
            <option value="">All Ratings</option>
            <option value="9">9.0+ ⭐⭐⭐⭐⭐</option>
            <option value="8">8.0+ ⭐⭐⭐⭐</option>
            <option value="7">7.0+ ⭐⭐⭐</option>
            <option value="6">6.0+ ⭐⭐</option>
            <option value="5">5.0+ ⭐</option>
          </select>
        </div>

        {(searchQuery || selectedGenre || minRating) && (
          <button
            onClick={() => {
              onSearchChange('');
              onGenreChange('');
              onRatingChange(undefined);
            }}
            className="clear-filters"
          >
            Clear Filters
          </button>
        )}
      </div>
    </div>
  );
}
