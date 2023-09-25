import { Meta } from '@storybook/react';
import { AffixInput } from './AffixInput';

const meta: Meta = {
  title: 'Atoms/AffixInput',
  component: AffixInput,
  args: {},
  argTypes: {
    isNumeric: {
      control: { type: 'boolean' },
    },
    thousandSeparator: {
      control: { type: 'boolean' },
    },
    prefix: {
      type: 'string',
    },
    suffix: {
      type: 'string',
    },
    error: {
      control: { type: 'boolean' },
    },
    disabled: {
      control: { type: 'boolean' },
    },
    showErrorIcon: {
      control: { type: 'boolean' },
    },
    size: {
      control: { type: 'number' },
    },
  },

  parameters: {
    controls: {
      exclude: [
        'ariaLabel',
        'className',
        'control',
        'defaultChecked',
        'defaultValue',
        'fieldHandlers',
        'label',
        'options',
        'pattern',
        'value',
      ],
    },
  },
};

export default meta;

export const Text = {
  args: {
    isNumeric: false,
    placeholder: 'Basic text',
  },
};

export const Numeric = {
  args: {
    isNumeric: true,
    thousandSeparator: true,
    placeholder: 'Numeric + formatted',
  },
};

export const Unformatted = {
  args: {
    isNumeric: true,
    placeholder: 'Numeric + unformatted',
    thousandSeparator: false,
  },
};

export const Prefix = {
  args: {
    prefix: '$',
    placeholder: 'Numeric + prefix',
    isNumeric: true,
    thousandSeparator: true,
  },
};

export const Suffix = {
  args: {
    placeholder: 'Area',
    suffix: 'm²',
    size: 3,
    isNumeric: true,
    thousandSeparator: true,
  },
};

export const SuffixUnformatted = {
  args: {
    placeholder: 'Weight',
    suffix: 'kg',
    size: 3,
    thousandSeparator: false,
  },
};

export const ErrorIcon = {
  args: {
    prefix: '$',
    placeholder: 'Numeric + prefix',
    isNumeric: true,
    thousandSeparator: true,
    error: true,
  },
};

export const NoErrorIcon = {
  args: {
    prefix: '$',
    placeholder: 'Numeric + prefix',
    isNumeric: true,
    thousandSeparator: true,
    showErrorIcon: false,
    error: true,
  },
};
