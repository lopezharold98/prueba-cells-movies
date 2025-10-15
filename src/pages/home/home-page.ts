import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { MoviesDataManager } from '../../data/movies-data-manager';

function navigateTo(path: string) {
  history.pushState({}, '', path);
  window.dispatchEvent(new PopStateEvent('popstate'));
}

@customElement('home-page')
export class HomePage extends LitElement {
  private dataManager = new MoviesDataManager();
  @state() movies: any[] = [];
  @state() error: string | null = null;

  static styles = css`
    .movies {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
      gap: 1rem;
      padding: 1rem;
    }
    .movie {
      cursor: pointer;
      text-align: center;
      transition: transform 0.2s;
    }
    .movie:hover {
      transform: scale(1.05);
    }
    img {
      border-radius: 12px;
      width: 100%;
    }
  `;

  async connectedCallback() {
    super.connectedCallback();
    await this.dataManager.loadMovies();
    this.movies = this.dataManager.get('movies');
    this.error = this.dataManager.get('error');
  }

  goToDetail(movieId: number) {
    navigateTo(`/movie/${movieId}`);
  }

  render() {
    if (this.error) {
      return html`<p>Error: ${this.error}</p>`;
    }

    if (!this.movies || this.movies.length === 0) {
      return html`<p>No se encontraron películas.</p>`;
    }

    return html`
      <section class="movies">
        ${this.movies.map(
          (m) => html`
            <div class="movie" @click=${() => this.goToDetail(m.id)}>
              <img src="https://image.tmdb.org/t/p/w500${m.poster_path}" alt="${m.title}" />
              <h3>${m.title}</h3>
            </div>
          `
        )}
      </section>
    `;
  }
}
