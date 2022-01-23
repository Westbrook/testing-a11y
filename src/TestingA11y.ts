import { LitElement, html, PropertyValues, render } from 'lit';
import { property } from 'lit/decorators.js';

export class TestingA11y extends LitElement {
  @property()
  description = '';

  @property()
  label = '';

  emmit() {
    return html`
      <label for="input">${this.label}</label>
      <input id="input" aria-describedby="description" />
      <div id="description">${this.description}</div>
    `;
  }

  update(changes: PropertyValues<this>) {
    if (changes.has('description') || changes.has('label')) {
      render(this.emmit(), this, { host: this });
    }
    super.update(changes);
  }

  render() {
    return html`<slot></slot>`;
  }
}
