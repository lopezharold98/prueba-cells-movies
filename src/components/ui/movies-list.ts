import { LitElement, html, css } from 'lit';
import { property, state } from 'lit/decorators.js';
import type { Movie } from '../../types/movie';
import { moviesStore } from '../../state/movies-store';

export class MoviesList extends LitElement {
  static styles = css`
    :host { display:block; font-family: system-ui, Arial; padding: 1rem; }
    header { display:flex; gap: 1rem; align-items:center; margin-bottom:1rem; }
    input { flex:1; padding:8px; border-radius:6px; border:1px solid #ccc; }
    .grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(160px,1fr)); gap:1rem; }
    .card { cursor:pointer; border-radius:8px; overflow:hidden; box-shadow:0 1px 3px rgba(0,0,0,0.08); background:white; }
    .poster { width:100%; height:240px; object-fit:cover; display:block; background:#eee; }
    .meta { padding:8px; }
    h3 { margin:0 0 6px 0; font-size:1rem; }
    small { color:#666; }
  `;

  @state() movies: Movie[] = [];
  @state() filter = '';
  @state() loading = false;

  connectedCallback() {
    super.connectedCallback();
    // Listen to store events
    moviesStore.addEventListener('movies-updated', (e: any) => {
      this.movies = e.detail;
    });
    moviesStore.addEventListener('filter-changed', (e: any) => {
      this.filter = e.detail;
    });
    moviesStore.addEventListener('loading-changed', (e: any) => {
      this.loading = e.detail;
    });
    moviesStore.addEventListener('error', (e: any) => {
      console.error('Store error:', e.detail);
    });

    //Valido que si no hay peliculas cargadas, las busque
    if (moviesStore.movies.length === 0) {
      
      const dm = document.querySelector('movies-data-manager') as any;
      if (dm) dm.fetchPopular();
      else void moviesStore.fetchPopular();
    } else {
      this.movies = moviesStore.movies;
    }
  }

  //Valido que si el filtro cambia, se actualicen las peliculas
  get filtered() {
    return moviesStore.getFilteredMovies();
  }

  //Valido que si el usuario escribe en el input, se actualice el filtro en el store
  onSearch(e: Event) {
    const q = (e.target as HTMLInputElement).value;
    moviesStore.setFilter(q);
  }

  goToDetail(id: number) {
    history.pushState({}, '', `/movie/${id}`);
    //Dispatch para que el router escuche el cambio de URL
    window.dispatchEvent(new PopStateEvent('popstate'));
  }

  renderPoster(path: string | null) {
    return path ? `https://image.tmdb.org/t/p/w300${path}` : '';
  }

  render() {
    return html`
      <header>
        <h2>Películas Populares</h2>
        <input placeholder="Buscar por título..." @input=${this.onSearch} />
      </header>

      ${this.loading ? html`<p>Cargando...</p>` : null}

      <div class="grid">
        ${this.filtered.map(m => html`
          <div class="card" @click=${() => this.goToDetail(m.id)}>
            <img class="poster" src="${this.renderPoster(m.poster_path)}" alt="${m.title}" />
            <div class="meta">
              <h3>${m.title}</h3>
              <small>${m.release_date}</small>
            </div>
          </div>
        `)}
      </div>
    `;
  }
}

customElements.define('movies-list', MoviesList);
