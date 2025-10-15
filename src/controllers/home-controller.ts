import { MovieService } from '../services/movie-service.js';
import { ElementController } from '@open-cells/element-controller';

export class HomeController extends ElementController {
  movies = [];
  filteredMovies = [];
  query = '';
  error = null;
  movieService;

  constructor(host: HTMLElement) {
    super(host);
    this.movieService = new MovieService(); 
  }

  async loadMovies() {
    try {
      const data = await this.movieService.getPopularMovies(); 
      this.movies = data;
      this.filteredMovies = data;
      this.error = null;
      this.host.requestUpdate();
    } catch (e) {
      console.error('HomeController.loadMovies →', e);
      this.error = this.movieService.getError() || 'Error al cargar las películas';
      this.host.requestUpdate();
    }
  }

  searchMovies(query: string) {
    this.query = query.toLowerCase();
    this.filteredMovies = this.movies.filter((m) =>
      m.title.toLowerCase().includes(this.query)
    );
    this.host.requestUpdate();
  }
}
