import { html, LitElement, PropertyValues } from 'lit';
import { property, query } from 'lit/decorators.js';

import { conditionAttributeWithId } from './condition-attribute-with-id.js';

export class TestingA11yHelpText extends LitElement {
    @property()
    for = '';

    @query('slot')
    public slotEl!: HTMLSlotElement;

    forElement: HTMLElement | undefined;

    private conditionDescribedby?: () => void;

    private conditionDescription?: () => void;

    async resolveForElement() {
        if (this.conditionDescription) this.conditionDescription();
        if (this.conditionDescribedby) this.conditionDescribedby();
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
                this.conditionDescribedby = conditionAttributeWithId(this.forElement, 'aria-describedby', this.id);
            } else {
                const proxy = document.createElement('span');
                proxy.id = 'complex-non-reusable-id';
                proxy.hidden = true;
                proxy.textContent = this.labelText;
                this.forElement.insertAdjacentElement('afterend', proxy);
                const conditionDescribedby = conditionAttributeWithId(this.forElement, 'aria-describedby', 'complex-non-reusable-id');
                this.conditionDescribedby = () => {
                    proxy.remove();
                    conditionDescribedby();
                }
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

    update(changes: PropertyValues<this>) {
        if (changes.has('for')) {
            this.resolveForElement();
        }

        super.update(changes);
    }

    render() {
        return html`<slot></slot>`;
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
