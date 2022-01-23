import { html, TemplateResult } from 'lit';
import '../src/testing-a11y.js';

export default {
  title: 'TestingA11y',
  component: 'testing-a11y',
  argTypes: {
    title: { control: 'text' },
    counter: { control: 'number' },
    textColor: { control: 'color' },
  },
};

interface Story<T> {
  (args: T): TemplateResult;
  args?: Partial<T>;
  argTypes?: Record<string, unknown>;
}

interface ArgTypes {
  label?: string;
  description?: string;
}

const Template: Story<ArgTypes> = ({ label, description } = {}) => html`
  <testing-a11y>
    <div slot="label">${label}</div>
    <div slot="description">${description}</div>
  </testing-a11y>
`;

export const Default = (args: ArgTypes) => Template(args);
Default.args = {
  label: 'Name',
  description: 'Please supply a name or combination of names by which you would like to be referred.',
}
