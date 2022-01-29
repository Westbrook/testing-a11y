import { html, LitElement, PropertyValues } from 'lit';
import { property, query } from 'lit/decorators.js';

import { conditionAttributeWithId } from './condition-attribute-with-id.js';

export class TestingA11yLabel extends LitElement {
    @property()
    for = '';

    @query('slot')
    public slotEl!: HTMLSlotElement;

    forElement: HTMLElement | undefined;

    private conditionLabelledby?: () => void;

    private conditionLabel?: () => void;

    click() {
        this.handleClick();
    }

    async resolveForElement() {
        if (this.conditionLabel) this.conditionLabel();
        if (this.conditionLabelledby) this.conditionLabelledby();
        if (!this.for) {
            delete this.forElement;
            return;
        }
        const parent = this.getRootNode() as HTMLElement;
        const target = parent.querySelector(`#${this.for}`) as LitElement & { focusElement: HTMLElement };
        if (!target) {
            return;
        }
        if (target.localName.search('-') > 0) {
            await customElements.whenDefined(target.localName);
        }
        if (typeof target.updateComplete !== 'undefined') {
            await target.updateComplete;
        }
        this.forElement = target.focusElement || target;
        if (this.forElement) {
            const targetParent = this.forElement.getRootNode() as HTMLElement;
            if (targetParent === parent) {
                this.conditionLabelledby = conditionAttributeWithId(this.forElement, 'aria-labelledby', this.id);
            } else {
                this.forElement.setAttribute('aria-label', this.labelText);
                this.conditionLabel = () => this.forElement?.removeAttribute('aria-label');
            }
        }
    }

    private get labelText(): string {
        const assignedNodes = this.slotEl.assignedNodes({ flatten: true });
        if (!assignedNodes.length) {
            return '';
        }
        const labelText = assignedNodes.map((node) =>
            (node.textContent || /* c8 ignore next */ '').trim()
        );
        return labelText.join(' ');
    }

    handleClick() {
        if (!this.forElement) return;
        this.forElement.focus();
    }

    update(changes: PropertyValues<this>) {
        if (changes.has('for')) {
            this.resolveForElement();
        }

        super.update(changes);
    }

    render() {
        return html`<slot></slot>`;
    }

    protected firstUpdated(): void {
        this.addEventListener('click', this.handleClick);
    }

    public connectedCallback(): void {
        super.connectedCallback();
        if (!this.observer) {
            this.observer = new MutationObserver(() => this.resolveForElement());
        }
        this.observer.observe(this, { characterData: true, subtree: true, childList: true });
    }

    public disconnectedCallback(): void {
        this.observer.disconnect();
        super.disconnectedCallback();
    }

    private observer!: MutationObserver;
}
