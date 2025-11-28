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
  [key: string]: unknown;
}
