import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { readFileSync } from 'node:fs';
import type { Movie } from '../types/movie.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let moviesCache: Movie[] | null = null;

function parseCSV(csvContent: string): Movie[] {
  const lines = csvContent.split('\n');
  
  const movies: Movie[] = [];
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    // Handle CSV parsing with quoted fields
    const values: string[] = [];
    let current = '';
    let inQuotes = false;
    
    for (let j = 0; j < line.length; j++) {
      const char = line[j];
      
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        values.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    values.push(current.trim());
    
    if (values.length >= 11) {
      const movie: Movie = {
        id: parseInt(values[0], 10),
        title: values[1],
        mpaaRating: values[2],
        budget: parseInt(values[3], 10),
        gross: parseInt(values[4], 10),
        releaseDate: values[5],
        genre: values[6],
        runtime: parseInt(values[7], 10),
        rating: parseFloat(values[8]),
        ratingCount: parseInt(values[9].replace(/,/g, ''), 10),
        summary: values[10].replace(/^"|"$/g, '')
      };
      movies.push(movie);
    }
  }
  
  return movies;
}

export function loadMovies(): Movie[] {
  if (moviesCache) {
    return moviesCache;
  }
  
  // In production (compiled), look in src/data
  // In development, it's relative to the compiled dist folder
  const csvPath = join(__dirname, '..', '..', 'src', 'data', 'movies.csv');
  const csvContent = readFileSync(csvPath, 'utf-8');
  moviesCache = parseCSV(csvContent);
  
  return moviesCache;
}

export function getMovieById(id: number): Movie | undefined {
  const movies = loadMovies();
  return movies.find(movie => movie.id === id);
}
