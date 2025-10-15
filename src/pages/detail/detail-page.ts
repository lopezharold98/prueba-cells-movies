import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { getRouterParams } from '@open-cells/core/router';
import { TMDB_CONFIG } from '../../config/tmdb-config.js';

@customElement('detail-page')
export class DetailPage extends LitElement {
  @state() movie: any = null;

  static styles = css`
    :host {
      display: block;
      padding: 2rem;
      background: #f5f6fa;
      color: #333;
      min-height: 100vh;
    }

    .container {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
    }

    img {
      width: 300px;
      border-radius: 16px;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
      margin-bottom: 1.5rem;
    }

    h2 {
      margin: 0.5rem 0;
    }

    p {
      max-width: 600px;
      line-height: 1.5;
    }

    .genres {
      color: #555;
      margin-top: 0.5rem;
    }
  `;

  async connectedCallback() {
    super.connectedCallback();
    const params = getRouterParams();
    const id = params.id;

    try {
      const response = await fetch(
        `${TMDB_CONFIG.BASE_URL}/movie/${id}?api_key=${TMDB_CONFIG.API_KEY}&language=es-ES`
      );
      const data = await response.json();
      this.movie = data;
    } catch (error) {
      console.error('Error loading movie details', error);
    }
  }

  render() {
    if (!this.movie) {
      return html`<p>Cargando detalles...</p>`;
    }

    return html`
      <div class="container">
        <img
          src="https://image.tmdb.org/t/p/w500${this.movie.poster_path}"
          alt="${this.movie.title}"
        />
        <h2>${this.movie.title}</h2>
        <p>${this.movie.overview}</p>
        <p>⭐ ${this.movie.vote_average} / 10</p>
        <p class="genres">
          ${this.movie.genres?.map((g: any) => g.name).join(', ')}
        </p>
      </div>
    `;
  }
}
