import { LitElement, html } from 'lit';
import { conditionAttributeWithId } from './condition-attribute-with-id.js';

export class TestingA11y extends LitElement {
  static instanceCount = 0;

  instanceCount: number;

  conditionDescribedby!: () => void;

  conditionLabel!: () => void;

  constructor() {
    super();
    this.instanceCount = TestingA11y.instanceCount;
    TestingA11y.instanceCount += 1;
  }

  handleSlotChange() {
    if (this.conditionLabel) this.conditionLabel();
    if (this.conditionDescribedby) this.conditionDescribedby();
    const input = this.querySelector('input');
    const label = this.querySelector('label');
    const descriptors = this.querySelectorAll('*:not(input):not(label)');
    const descriptorIds: string[] = [];
    if (descriptors.length) {
      descriptors.forEach((descriptor, i) => {
        if (!descriptor.id) {
          // eslint-disable-next-line no-param-reassign
          descriptor.id = `testing-a11y-input-${this.instanceCount}-${i}`;
        }
        descriptorIds.push(descriptor.id);
      })
    }
    if (input) {
      if (!input.id) {
        input.id = `testing-a11y-input-${this.instanceCount}`;
      }
      if (label) {
        this.conditionLabel =
          conditionAttributeWithId(label, 'for', input.id);
      }
      if (descriptorIds.length) {
        this.conditionDescribedby =
        conditionAttributeWithId(input, 'aria-describedby', descriptorIds);
      }
    }
  }

  render() {
    return html`<slot @slotchange=${this.handleSlotChange}></slot>`;
  }
}