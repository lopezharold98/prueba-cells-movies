import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { TMDB_CONFIG } from '../../config/tmdb-config.js';
const Router = {
  getCurrentParams() {
    const params: any = {};
    try {
      const url = new URL(window.location.href);
      if (url.searchParams.has('id')) {
        params.id = url.searchParams.get('id') || '';
      } else {
        const segments = url.pathname.split('/').filter(Boolean);
        params.id = segments.length ? segments[segments.length - 1] : '';
      }
    } catch (e) {
      params.id = '';
    }
    return params;
  }
};


@customElement('detail-page')
export class DetailPage extends LitElement {
  @property({ type: String }) id = '';
  @state() movie: any = null;
  @state() error: string | null = null;

  static styles = css`
    .container {
      padding: 2rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
    }
    img {
      width: 300px;
      border-radius: 16px;
    }
    h1 {
      margin-top: 1rem;
    }
    p {
      max-width: 600px;
      color: #555;
    }
  `;

  async connectedCallback() {
    super.connectedCallback();
    const params = Router.getCurrentParams();
    this.id = params.id;
    await this.loadMovieDetail();
  }

  async loadMovieDetail() {
    try {
      const res = await fetch(
        `${TMDB_CONFIG.BASE_URL}/movie/${this.id}?api_key=${TMDB_CONFIG.API_KEY}&language=es-ES`
      );
      if (!res.ok) throw new Error('Error al cargar detalles');
      this.movie = await res.json();
    } catch (err) {
      console.error(err);
      this.error = 'No se pudo cargar el detalle de la película.';
    }
  }

  render() {
    if (this.error) return html`<p>${this.error}</p>`;
    if (!this.movie) return html`<p>Cargando...</p>`;

    return html`
      <div class="container">
        <img src="https://image.tmdb.org/t/p/w500${this.movie.poster_path}" alt="${this.movie.title}" />
        <h1>${this.movie.title}</h1>
        <p>${this.movie.overview}</p>
        <p><strong>Fecha de lanzamiento:</strong> ${this.movie.release_date}</p>
        <p><strong>Calificación:</strong> ⭐ ${this.movie.vote_average}</p>
      </div>
    `;
  }
}
