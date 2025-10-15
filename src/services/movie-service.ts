import { MoviesDataManager } from '../data/movies-data-manager.js';

export class MovieService {
  constructor() {
    this.dataManager  = new MoviesDataManager();
  }

  async getPopularMovies() {
    const cached = this.dataManager.getMovies();
    if (cached && cached.length > 0) return cached;

    await this.dataManager.loadMovies();
    return this.dataManager.getMovies();
  }

  async getMovieById(id) {
    const cached = this.dataManager.getMovieById(id);
    if (cached) return cached;

    const movie = await this.dataManager.loadMovieById(id);
    return movie;
  }

  getError() {
    return this.dataManager.getError();
  }
}
