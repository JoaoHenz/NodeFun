export interface Movie {
  id: number;
  title: string;
  mpaaRating: string;
  budget: number;
  gross: number;
  releaseDate: string;
  genre: string;
  runtime: number;
  rating: number;
  ratingCount: number;
  summary: string;
}

export interface MovieStats {
  totalMovies: number;
  genres: string[];
  totalBudget: number;
  totalGross: number;
  averageRating: number;
  averageRuntime: number;
}
