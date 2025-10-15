
export class DataManager {
  state: any;
  constructor() {

    this.state = new Map();
  }

  /**
   * Guarda un valor en el estado bajo una clave determinada.
   * @param {string} key - Clave asociada al valor.
   * @param {any} value - Valor a guardar.
   */
  set(key: string, value: string | never[] | null) {
    this.state.set(key, value);
  }

  /**
   * Recupera un valor almacenado en el estado.
   * @param {string} key - Clave del valor a obtener.
   * @returns {any | undefined} Valor correspondiente o undefined si no existe.
   */
  get(key:string) {
    return this.state.get(key);
  }

  
  delete(key: string) {
    this.state.delete(key);
  }

  
  clear() {
    this.state.clear();
  }
}
