import { fixture, expect, nextFrame } from '@open-wc/testing';
import { sendKeys } from '@web/test-runner-commands';
import { TestingA11yInput, TestingA11yLabel } from '../src/index.js';
import '../src/testing-a11y.js';
import { Default } from '../stories/index.stories.js';
import { findDescribedNode, browserName } from './helpers.js';

describe(`TestingA11y: ${browserName()}`, () => {
  it('passes the aXe-core audit', async () => {
    const el = await fixture<HTMLDivElement>(Default(Default.args));

    await expect(el).to.be.accessible();
  });

  it('focuses the input on label clicks', async () => {
    const el = await fixture<HTMLDivElement>(Default(Default.args));
    const label = el.querySelector('testing-a11y-label') as TestingA11yLabel;
    const input = el.querySelector('testing-a11y-input') as TestingA11yInput;

    label.click();

    expect(document.activeElement === input, `activeElement: ${document.activeElement}`).to.be.true;
    expect(input.shadowRoot.activeElement === input.focusElement, `activeElement: ${document.activeElement}`).to.be.true;
  });

  it(`is labelled "${Default.args.label}" and described as "${Default.args.description}"`, async () => {
    await fixture<HTMLDivElement>(Default(Default.args));

    await findDescribedNode(Default.args.label, Default.args.description);
  });

  it(`can be labelled and described dynamically`, async () => {
    const label = 'Custom label';
    const description = 'Custom description';
    await fixture<HTMLDivElement>(Default({
      label,
      description,
    }));

    await findDescribedNode(label, description);
  });

  it(`can have label and description changed over time`, async () => {
    const secondLabel = 'Custom label';
    const secondDescription = 'Custom description';
    const test = await fixture<HTMLDivElement>(Default(Default.args));

    await findDescribedNode(Default.args.label, Default.args.description);

    const labelEl = test.querySelector('testing-a11y-label') as HTMLElement;
    const descriptionEl = test.querySelector('testing-a11y-help-text') as HTMLElement;

    labelEl.textContent = secondLabel;
    descriptionEl.textContent = secondDescription;

    await nextFrame();

    await findDescribedNode(secondLabel, secondDescription);
  });

  it('is part of the tab order', async () => {
    const el = await fixture<HTMLDivElement>(Default(Default.args));
    const input = el.querySelector('testing-a11y-input') as HTMLInputElement;
    const beforeInput = document.createElement('input');
    const afterInput = document.createElement('input');
    el.insertAdjacentElement('beforebegin', beforeInput);
    el.insertAdjacentElement('afterend', afterInput);
    beforeInput.focus();
    expect(document.activeElement === beforeInput, `activeElement: ${document.activeElement}`).to.be.true;
    await sendKeys({
      press: 'Tab',
    });
    expect(document.activeElement === input, `activeElement: ${document.activeElement}`).to.be.true;
    await sendKeys({
      press: 'Tab',
    });
    expect(document.activeElement === afterInput, `activeElement: ${document.activeElement}`).to.be.true;
    await sendKeys({
      press: 'Shift+Tab',
    });
    expect(document.activeElement === input, `activeElement: ${document.activeElement}`).to.be.true;
    await sendKeys({
      press: 'Shift+Tab',
    });
    expect(document.activeElement === beforeInput, `activeElement: ${document.activeElement}`).to.be.true;
  });
});
