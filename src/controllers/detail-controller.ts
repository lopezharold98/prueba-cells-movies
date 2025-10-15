import { ElementController } from '@open-cells/element-controller';
import { MovieService } from '../services/movie-service.js';

export class DetailController extends ElementController {
  movie = null;
  error = null;
  movieService;

  constructor(host: HTMLElement) {
    super(host);
    this.movieService = new MovieService();
  }

  async loadMovieDetail(id: string) {
    try {
      const data = await this.movieService.getMovieById(id); 
      this.movie = data;
      this.error = null;
      this.host.requestUpdate();
    } catch (e) {
      console.error('Error loading movie detail:', e);
      this.error = this.movieService.getError() || 'No se pudo cargar el detalle de la película.';
      this.host.requestUpdate();
    }
  }
}
