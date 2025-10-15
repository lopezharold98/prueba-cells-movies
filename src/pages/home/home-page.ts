import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { navigate } from '@open-cells/core';
import { ElementController } from '@open-cells/element-controller';
import { MovieService } from '../../services/movie-service.js'; // ✅ Importamos el servicio

@customElement('home-page')
export class HomePage extends LitElement {
  controller = new ElementController(this);

  @state() movies: any[] = [];
  @state() filteredMovies: any[] = [];
  @state() query: string = '';
  @state() error: string | null = null;

  static styles = css`
    :host {
      display: block;
      background-color: #f8f9fa;
      min-height: 100vh;
      padding: 2rem;
      color: #333;
    }

    h1 {
      text-align: center;
      font-size: 2rem;
      color: #222;
      margin-bottom: 1.5rem;
    }

    input[type="text"] {
      display: block;
      width: 100%;
      max-width: 400px;
      margin: 0 auto 2rem auto;
      padding: 0.8rem 1rem;
      font-size: 1rem;
      border: 1px solid #ccc;
      border-radius: 8px;
      outline: none;
      transition: all 0.2s ease;
    }

    input[type="text"]:focus {
      border-color: #0078d7;
      box-shadow: 0 0 4px rgba(0, 120, 215, 0.4);
    }

    .movies-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
      gap: 1.5rem;
      justify-items: center;
    }

    .movie-card {
      background: #fff;
      border-radius: 16px;
      overflow: hidden;
      cursor: pointer;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
      transition: transform 0.2s ease, box-shadow 0.2s ease;
      width: 100%;
      max-width: 200px;
    }

    .movie-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 6px 18px rgba(0, 0, 0, 0.15);
    }

    .movie-card img {
      width: 100%;
      display: block;
      height: 270px;
      object-fit: cover;
    }

    .movie-card h3 {
      margin: 0.8rem;
      font-size: 1rem;
      text-align: center;
      color: #333;
    }

    .no-results {
      text-align: center;
      color: #888;
      font-size: 1.1rem;
      margin-top: 2rem;
    }
  `;

  connectedCallback() {
    super.connectedCallback();
    this.loadMovies();
  }

  async loadMovies() {
    try {
      const movies = await MovieService.getPopularMovies();
      this.movies = movies;
      this.filteredMovies = movies;
    } catch (err) {
      this.error = 'No se pudieron cargar las películas.';
    }
  }

  handleSearch(event: InputEvent) {
    const value = (event.target as HTMLInputElement).value.toLowerCase();
    this.query = value;
    this.filteredMovies = this.movies.filter((movie) =>
      movie.title.toLowerCase().includes(value)
    );
  }

  goToDetail(movieId: number) {
    navigate('movie-detail', { id: movieId });
  }

  render() {
    if (this.error) {
      return html`<p class="no-results">${this.error}</p>`;
    }

    return html`
      <h1>Películas Populares</h1>

      <input
        type="text"
        placeholder="Buscar por título..."
        .value=${this.query}
        @input=${this.handleSearch}
      />

      ${this.filteredMovies.length === 0
        ? html`<p class="no-results">
            No se encontraron películas con ese título.
          </p>`
        : html`
            <div class="movies-grid">
              ${this.filteredMovies.map(
                (movie) => html`
                  <div
                    class="movie-card"
                    @click=${() => this.goToDetail(movie.id)}
                  >
                    <img
                      src="https://image.tmdb.org/t/p/w300${movie.poster_path}"
                      alt=${movie.title}
                    />
                    <h3>${movie.title}</h3>
                  </div>
                `
              )}
            </div>
          `}
    `;
  }
}
