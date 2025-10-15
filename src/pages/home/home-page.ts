import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';
import { navigate } from '@open-cells/core';
import { HomeController } from '../../controllers/home-controller.js';
import { Movie } from '../../types/movie.js';

@customElement('home-page')
export class HomePage extends LitElement {
  controller = new HomeController(this);

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

    input[type='text'] {
      display: block;
      width: 100%;
      max-width: 400px;
      margin: 0 auto 2rem auto;
      padding: 0.8rem 1rem;
      font-size: 1rem;
      border: 1px solid #ccc;
      border-radius: 8px;
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
      width: 100%;
      max-width: 200px;
    }

    .movie-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 6px 18px rgba(0, 0, 0, 0.15);
    }

    .movie-card img {
      width: 100%;
      height: 270px;
      object-fit: cover;
    }

    .no-results {
      text-align: center;
      color: #888;
      margin-top: 2rem;
    }
  `;

  connectedCallback() {
    super.connectedCallback();
    this.controller.loadMovies();
  }

  handleSearch(event: InputEvent) {
    const query = (event.target as HTMLInputElement).value;
    this.controller.searchMovies(query);
  }

  goToDetail(id: number) {
    navigate('movie-detail', { id });
  }

  render() {
    const { filteredMovies, query, error } = this.controller;

    if (error) {
      return html`<p class="no-results">${error}</p>`;
    }

    return html`
      <h1>Películas Populares</h1>

      <input
        type="text"
        placeholder="Buscar por título..."
        .value=${query}
        @input=${this.handleSearch}
      />

      ${filteredMovies.length === 0
        ? html`<p class="no-results">No se encontraron resultados.</p>`
        : html`
            <div class="movies-grid">
              ${filteredMovies.map(
                (movie : Movie) => html`
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
