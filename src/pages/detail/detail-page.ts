import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { ElementController } from '@open-cells/element-controller';

@customElement('detail-page')
export class DetailPage extends LitElement {
  elementController = new ElementController(this);

  @property({ type: String }) itemId = '';

  static styles = css`
    :host {
      display: block;
      padding: 2rem;
      color: #333;
    }

    h2 {
      color: #0066cc;
      margin-bottom: 1rem;
    }

    .container {
      background: #f7f9fb;
      padding: 1.5rem;
      border-radius: 12px;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    }

    button {
      margin-top: 1rem;
      padding: 0.5rem 1rem;
      background: #0078d4;
      color: white;
      border: none;
      border-radius: 8px;
      cursor: pointer;
    }

    button:hover {
      background: #005fa3;
    }
  `;

  render() {
    return html`
      <div class="container">
        <h2>Item Detail</h2>
        <p><strong>ID:</strong> ${this.itemId}</p>
        <p>This page shows details for the selected item.</p>
        <button @click=${this.goBack}>Go Back</button>
      </div>
    `;
  }

  goBack() {
    window.history.back();
  }
}
