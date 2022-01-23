import { html, TemplateResult } from 'lit';
import '../src/testing-a11y.js';

export default {
  title: 'TestingA11y',
  component: 'testing-a11y',
  args: {
    label: 'Default label',
    description: 'Default description'
  },
};

interface Story<T> {
  (args: T): TemplateResult;
  args?: Partial<T>;
  argTypes?: Record<string, unknown>;
}

interface ArgTypes {
  label: string;
  description: string;
}

const Template: Story<ArgTypes> = ({ label, description }) => html`
  <testing-a11y
    label=${label}
    description=${description}
  ></testing-a11y>
`;

export const Default = (args: ArgTypes) => Template(args);
Default.args = {
  label: 'Name',
  description: 'Please supply a name or combination of names by which you would like to be referred.',
}
