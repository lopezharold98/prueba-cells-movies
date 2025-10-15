import { TMDB_CONFIG } from '../config/tmdb-config.js';

export class MovieService {
  static async getPopularMovies() {
    try {
      const response = await fetch(
        `${TMDB_CONFIG.BASE_URL}/movie/popular?api_key=${TMDB_CONFIG.API_KEY}&language=es-ES`
      );
      if (!response.ok) throw new Error('Error fetching popular movies');
      const data = await response.json();
      return data.results;
    } catch (error) {
      console.error('MovieService.getPopularMovies:', error);
      throw error;
    }
  }

  static async getMovieById(id: string) {
    try {
      const response = await fetch(
        `${TMDB_CONFIG.BASE_URL}/movie/${id}?api_key=${TMDB_CONFIG.API_KEY}&language=es-ES`
      );
      if (!response.ok) throw new Error('Error fetching movie details');
      return await response.json();
    } catch (error) {
      console.error('MovieService.getMovieById:', error);
      throw error;
    }
  }
}
