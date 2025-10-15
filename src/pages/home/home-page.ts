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
  @state() filteredMovies: any[] = [];
  @state() error: string | null = null;
  @state() searchTerm: string = '';

  static styles = css`
    :host {
      display: block;
      background: #f8f9fa;
      min-height: 100vh;
      padding: 2rem;
    }

    h1 {
      text-align: center;
      color: #333;
    }

    .search-container {
      display: flex;
      justify-content: center;
      align-items: center;
      margin: 1rem auto 2rem;
      position: relative;
      width: 80%;
      max-width: 400px;
    }

    input {
      width: 100%;
      padding: 0.7rem 2.5rem 0.7rem 1rem;
      border: 1px solid #ccc;
      border-radius: 12px;
      font-size: 1rem;
      outline: none;
      transition: box-shadow 0.2s;
    }

    input:focus {
      border-color: #0078d7;
      box-shadow: 0 0 0 3px rgba(0, 120, 215, 0.2);
    }

    .clear-btn {
      position: absolute;
      right: 10px;
      background: transparent;
      border: none;
      cursor: pointer;
      font-size: 1.2rem;
      color: #666;
    }

    .movies {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 1.5rem;
      justify-items: center;
    }

    .movie {
      cursor: pointer;
      text-align: center;
      background: #fff;
      border-radius: 16px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      transition: all 0.3s ease;
      overflow: hidden;
      width: 100%;
      max-width: 220px;
    }

    .movie:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 18px rgba(0, 0, 0, 0.15);
    }

    img {
      border-radius: 16px 16px 0 0;
      width: 100%;
      height: 320px;
      object-fit: cover;
    }

    h3 {
      margin: 0.8rem 0;
      font-size: 1.05rem;
      color: #222;
      padding: 0 0.5rem;
    }

    p {
      color: #666;
      font-size: 0.9rem;
      margin-bottom: 0.8rem;
    }

    .error,
    .empty {
      text-align: center;
      color: #555;
      font-size: 1.1rem;
      margin-top: 2rem;
    }
  `;

  async connectedCallback() {
    super.connectedCallback();
    await this.dataManager.loadMovies();
    const movies = this.dataManager.get('movies');
    this.movies = movies;
    this.filteredMovies = movies;
    this.error = this.dataManager.get('error');
  }

  handleSearch(e: Event) {
    const value = (e.target as HTMLInputElement).value.toLowerCase();
    this.searchTerm = value;
    this.filteredMovies = this.movies.filter((movie) =>
      movie.title.toLowerCase().includes(value)
    );
  }

  clearSearch() {
    this.searchTerm = '';
    this.filteredMovies = this.movies;
  }

  goToDetail(movieId: number) {
    navigateTo(`/movie/${movieId}`);
  }

  render() {
    if (this.error) {
      return html`<p class="error">${this.error}</p>`;
    }

    return html`
      <h1>Películas Populares</h1>

      <div class="search-container">
        <input
          type="text"
          placeholder="Buscar película..."
          .value=${this.searchTerm}
          @input=${this.handleSearch}
        />
        ${this.searchTerm
          ? html`<button class="clear-btn" @click=${this.clearSearch}></button>`
          : null}
      </div>

      ${this.filteredMovies.length === 0
        ? html`<p class="empty">
            No se encontraron películas para
            "<strong>${this.searchTerm}</strong>"
          </p>`
        : html`
            <section class="movies">
              ${this.filteredMovies.map(
                (m) => html`
                  <div class="movie" @click=${() => this.goToDetail(m.id)}>
                    <img
                      src="https://image.tmdb.org/t/p/w500${m.poster_path}"
                      alt="${m.title}"
                    />
                    <h3>${m.title}</h3>
                    <p>${m.release_date}</p>
                  </div>
                `
              )}
            </section>
          `}
    `;
  }
}
