import { LitElement, html } from 'lit';
import { query } from 'lit/decorators.js';

export class TestingA11y extends LitElement {
  shadowRoot!: ShadowRoot;

  @query('input')
  public input!: HTMLInputElement;
  
  render() {
    return html`
      <label for="input">
        <slot name="label"></slot>
      </label>
      <input
        aria-describedby="description"
        aria-labelledby="label"
        id="input"
      />
      <div id="description">
        <slot name="description"></slot>
      </div>
    `;
  }
}
