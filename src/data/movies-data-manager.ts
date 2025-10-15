// Fallback minimal DataManager when '@open-cells/core/data-manager' is not available.
class DataManager {
  private state = new Map<string, any>();

  protected set(key: string, value: any): void {
    this.state.set(key, value);
  }

  protected get<T = any>(key: string): T | undefined {
    return this.state.get(key) as T | undefined;
  }
}

import { TMDB_CONFIG } from '../config/tmdb-config.js';

export class MoviesDataManager extends DataManager {
  async loadMovies() {
    try {
      const response = await fetch(
        `${TMDB_CONFIG.BASE_URL}/movie/popular?api_key=${TMDB_CONFIG.API_KEY}&language=en-US&page=1`
      );

      if (!response.ok) {
        throw new Error('Error fetching movies');
      }

      const data = await response.json();
      this.set('movies', data.results || []);
      this.set('error', null);
    } catch (error) {
      console.error('MoviesDataManager → loadMovies() failed:', error);
      this.set('movies', []);
      this.set('error', 'Unable to load movies.');
    }
  }
}
