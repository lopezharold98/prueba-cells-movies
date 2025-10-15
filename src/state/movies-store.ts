import type { Movie, TMDBListResponse } from '../types/movie';

type Listener = (detail?: any) => void;

class MoviesStore extends EventTarget {
  movies: Movie[] = [];
  loading = false;
  error: string | null = null;
  movieDetail: Movie | null = null;
  filter = '';

  private TMDB_KEY = (import.meta as any).env?.TMDB_API_KEY as string;
  private BASE = 'https://api.themoviedb.org/3';

  async fetchPopular() {
    this.loading = true;
    this._emit('loading-changed', true);
    try {
      const url = `${this.BASE}/movie/popular?api_key=${this.TMDB_KEY}&language=es-ES&page=1`;
      const res = await fetch(url);
      const data: TMDBListResponse = await res.json();
      this.movies = data.results;
      this._emit('movies-updated', this.movies);
    } catch (err: any) {
      this.error = err?.message ?? String(err);
      this._emit('error', this.error);
    } finally {
      this.loading = false;
      this._emit('loading-changed', false);
    }
  }

  async fetchMovieDetail(id: number) {
    this.loading = true;
    this._emit('loading-changed', true);
    try {
      const url = `${this.BASE}/movie/${id}?api_key=${this.TMDB_KEY}&language=es-ES`;
      const res = await fetch(url);
      const data: Movie = await res.json();
      this.movieDetail = data;
      this._emit('movie-detail-updated', this.movieDetail);
    } catch (err: any) {
      this.error = err?.message ?? String(err);
      this._emit('error', this.error);
    } finally {
      this.loading = false;
      this._emit('loading-changed', false);
    }
  }

  setFilter(q: string) {
    this.filter = q;
    this._emit('filter-changed', this.filter);
  }

  getFilteredMovies(): Movie[] {
    if (!this.filter) return this.movies;
    const q = this.filter.toLowerCase();
    return this.movies.filter(m => m.title.toLowerCase().includes(q));
  }

  private _emit(name: string, detail?: any) {
    this.dispatchEvent(new CustomEvent(name, { detail }));
  }
}

export const moviesStore = new MoviesStore();
