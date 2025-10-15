import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { DataManager } from '@open-cells/data-manager';

@customElement('home-page')
export class HomePage extends LitElement {
  static styles = css`
    :host {
      display: block;
      padding: 1rem;
      font-family: 'Arial', sans-serif;
    }
    h2 {
      color: #0072bb;
    }
    ul {
      list-style: none;
      padding: 0;
    }
    li {
      background: #f7f7f7;
      margin: 0.5rem 0;
      padding: 1rem;
      border-radius: 8px;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    }
  `;

  // Estado reactivo
  @state()
  items: any[] = [];

  // DataManager para manejar peticiones
  private dataManager = new DataManager();

  connectedCallback() {
    super.connectedCallback();
    this.loadData();
  }

  async loadData() {
    try {
      // Puedes usar una API real o un mock local (ejemplo: ./mock-data.json)
      const url = 'https://jsonplaceholder.typicode.com/posts?_limit=5';
      const response = await this.dataManager.fetch(url);
      const data = await response.json();
      this.items = data;
    } catch (error) {
      console.error('Error loading data:', error);
    }
  }

  render() {
    return html`
      <section>
        <h2>Movies / Items</h2>
        <ul>
          ${this.items.length > 0
            ? this.items.map(item => html`<li><strong>${item.title}</strong></li>`)
            : html`<p>Loading...</p>`}
        </ul>
      </section>
    `;
  }
}
