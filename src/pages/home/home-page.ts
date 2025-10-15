import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { MoviesDataManager } from '../../data/movies-data-manager.js';
import { TMDB_CONFIG } from '../../config/tmdb-config.js';

@customElement('home-page')
export class HomePage extends LitElement {
  static styles = css`
    .movie-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 1rem;
    }
    .movie {
      background: #fff;
      border-radius: 8px;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
      padding: 0.5rem;
      text-align: center;
    }
    .error {
      text-align: center;
      color: red;
      margin-top: 2rem;
    }
  `;

  private manager = new MoviesDataManager();

  @state() movies: any[] = [];
  @state() error: string | null = null;

  async connectedCallback() {
    super.connectedCallback();
    await this.manager.loadMovies();
    this.movies = this.manager.get('movies') ?? [];
    this.error = this.manager.get('error');
  }

  render() {
    if (this.error) {
      return html`<p class="error">${this.error}</p>`;
    }

    if (!this.movies || this.movies.length === 0) {
      return html`<p class="error">No movies found.</p>`;
    }

    return html`
      <div class="movie-grid">
        ${this.movies.map(
          (movie) => html`
            <div class="movie">
              <img
                src="${TMDB_CONFIG.IMAGE_BASE}${movie.poster_path}"
                alt="${movie.title}"
                width="150"
              />
              <h4>${movie.title}</h4>
              <p>${movie.release_date}</p>
            </div>
          `
        )}
      </div>
    `;
  }
}
