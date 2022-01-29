import { html, LitElement } from 'lit';
import { query } from 'lit/decorators.js';

export class TestingA11yInput extends LitElement {
    shadowRoot!: ShadowRoot;
    
    @query('input')
    focusElement!: HTMLInputElement;

    render() {
        return html`
            <input />
        `;
    }
}
