import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { getCurrentRoute } from '@open-cells/core';
import { TMDB_CONFIG } from '../../config/tmdb-config.js';

@customElement('detail-page')
export class DetailPage extends LitElement {
  @state() movie: any = null;
  @state() error: string | null = null;
  private currentId: string | null = null;

  static styles = css`
    :host {
      display: block;
      padding: 2rem;
      background: #f5f6fa;
      color: #333;
      min-height: 100vh;
    }
    .container { display:flex; flex-direction:column; align-items:center; text-align:center; }
    img { width:300px; border-radius:16px; box-shadow:0 4px 10px rgba(0,0,0,0.2); margin-bottom:1.5rem; }
    h2 { margin:0.5rem 0; }
    p { max-width:600px; line-height:1.5; }
    .genres { color:#555; margin-top:0.5rem; }
    .error { color:#a00; text-align:center; margin-top:2rem; }
  `;

  connectedCallback() {
    super.connectedCallback();
    // Carga inicial
    this.loadFromRoute();

    // Reaccionar a cambios de ruta (history API y hash changes)
    window.addEventListener('popstate', this.onRouteChange);
    window.addEventListener('hashchange', this.onRouteChange);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('popstate', this.onRouteChange);
    window.removeEventListener('hashchange', this.onRouteChange);
  }

  private onRouteChange = () => {
    // cada vez que cambie la ruta comprobamos si el id cambió
    const route = getCurrentRoute();
    const newId = route?.params?.id ?? null;

    if (!newId) {
      // si no hay id, limpiamos
      this.currentId = null;
      this.movie = null;
      return;
    }

    if (this.currentId !== newId) {
      // si cambió el id, recargamos
      this.currentId = newId;
      this.loadMovieById(newId);
    }
  };

  private async loadFromRoute() {
    const route = getCurrentRoute();
    const id = route?.params?.id ?? null;
    if (!id) {
      this.error = 'ID de película no encontrado.';
      this.movie = null;
      return;
    }
    this.currentId = id;
    await this.loadMovieById(id);
  }

  private async loadMovieById(id: string) {
    this.movie = null;
    this.error = null;
    try {
      const response = await fetch(
        `${TMDB_CONFIG.BASE_URL}/movie/${id}?api_key=${TMDB_CONFIG.API_KEY}&language=es-ES`
      );
      if (!response.ok) throw new Error('Error en la respuesta de la API');
      this.movie = await response.json();
    } catch (err) {
      console.error('Error cargando detalles de la película:', err);
      this.error = 'No se pudo cargar la información de la película.';
    }
  }

  render() {
    if (this.error) {
      return html`<p class="error">${this.error}</p>`;
    }
    if (!this.movie) {
      return html`<p class="error">Cargando detalles...</p>`;
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
