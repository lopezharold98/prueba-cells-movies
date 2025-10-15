import { TMDB_CONFIG } from '../config/tmdb-config.js';
import { DataManager } from './data-manager.js';

export class MoviesDataManager {
  constructor() {
    this.state = {
      movies: [],
      movieDetails: new Map(), 
      error: null,
    };
  }

  async loadMovies() {
    try {
      const response = await fetch(
        `${TMDB_CONFIG.BASE_URL}/movie/popular?api_key=${TMDB_CONFIG.API_KEY}&language=es-ES&page=1`
      );

      if (!response.ok) throw new Error('Error fetching movies');

      const data = await response.json();
      this.state.movies = data.results || [];
      this.state.error = null;
    } catch (error) {
      console.error('MoviesDataManager → loadMovies() failed:', error);
      this.state.movies = [];
      this.state.error = 'No se pudieron cargar las películas.';
    }
  }

  async loadMovieById(id) {
    try {
      const response = await fetch(
        `${TMDB_CONFIG.BASE_URL}/movie/${id}?api_key=${TMDB_CONFIG.API_KEY}&language=es-ES`
      );
      if (!response.ok) throw new Error('Error fetching movie details');

      const data = await response.json();
      this.state.movieDetails.set(id, data);
      this.state.error = null;
      return data;
    } catch (error) {
      console.error('MoviesDataManager → loadMovieById() failed:', error);
      this.state.error = 'No se pudo cargar el detalle de la película.';
      return null;
    }
  }

  getMovies() {
    return this.state.movies;
  }

  getMovieById(id: number) {
    return this.state.movieDetails.get(id);
  }

  getError() {
    return this.state.error;
  }
}
