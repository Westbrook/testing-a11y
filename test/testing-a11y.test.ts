import { fixture, expect } from '@open-wc/testing';
import { sendKeys } from '@web/test-runner-commands';
import { TestingA11y } from '../src/TestingA11y.js';
import '../src/testing-a11y.js';
import { Default } from '../stories/index.stories.js';
import { findDescribedNode, browserName } from './helpers.js';

describe(`TestingA11y: ${browserName()}`, () => {
  it('passes the aXe-core audit', async () => {
    const el = await fixture<TestingA11y>(Default(Default.args));

    await expect(el).to.be.accessible();
  });

  it('focuses the input on label clicks', async () => {
    const el = await fixture<TestingA11y>(Default(Default.args));
    const label = el.querySelector('label') as HTMLLabelElement;
    const input = el.querySelector('input') as HTMLInputElement;

    label.click();

    expect(document.activeElement === input, `activeElement: ${document.activeElement}`).to.be.true;
  });

  it(`is labelled "${Default.args.label}" and described as "${Default.args.description}"`, async () => {
    await fixture<TestingA11y>(Default(Default.args));

    await findDescribedNode(Default.args.label, Default.args.description);
  });

  it(`can be labelled and described dynamically`, async () => {
    const label = 'Custom label';
    const description = 'Custom description';
    await fixture<TestingA11y>(Default({
      label,
      description,
    }));

    await findDescribedNode(label, description);
  });

  it('is part of the tab order', async () => {
    const el = await fixture<TestingA11y>(Default(Default.args));
    const input = el.querySelector('input') as HTMLInputElement;
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
