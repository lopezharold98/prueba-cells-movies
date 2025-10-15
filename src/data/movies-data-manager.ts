// src/components/data/movies-data-manager.ts
import { moviesStore } from '../state/movies-store';

class MoviesDataManager extends HTMLElement {
  constructor() {
    super();
  }
  //Validar que el elemento este en el DOM
  connectedCallback() {
    
  }
    //Metodo para que otros componentes puedan llamar a la funcion fetchPopular del store
  async fetchPopular() {
    await moviesStore.fetchPopular();
  }
 
  //Metodo para que otros componentes puedan llamar a la funcion fetchDetail del store
  async fetchDetail(id: number) {
    await moviesStore.fetchMovieDetail(id);
  }

  setFilter(q: string) {
    moviesStore.setFilter(q);
  }
}

customElements.define('movies-data-manager', MoviesDataManager);
