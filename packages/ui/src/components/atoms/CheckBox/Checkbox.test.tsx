import React from 'react';
import { composeStories, render, screen } from '../../../test/test-utils';
import * as stories from './Checkbox.stories';

const { Unchecked, Checked, CheckedInvalid, DisabledUnchecked, DisabledChecked } = composeStories(stories);
const name = 'checkbox1';
const value = 'metal';

describe('atoms/Checkbox', () => {
  it('should be unchecked', async () => {
    render(<Unchecked />);

    const input = screen.getByTestId(`checkbox-${name}-${value}`);
    expect(input).not.toBeChecked();
  });

  it('should be checked', async () => {
    render(<Checked />);
    const input = screen.getByTestId(`checkbox-${name}-${value}`);
    expect(input).toBeChecked();
  });

  it('should be aria-invalid', async () => {
    render(<CheckedInvalid />);
    const input = screen.getByTestId(`checkbox-label-wrapper-${name}`);
    expect(input).toBeInvalid();
  });

  it('should be disabled and unchecked', async () => {
    render(<DisabledUnchecked />);
    const input = screen.getByTestId(`checkbox-${name}-${value}`);
    expect(input).toBeDisabled();
    expect(input).not.toBeChecked();
  });

  it('should be disabled and checked with 50% opacity', async () => {
    render(<DisabledChecked />);
    const input = screen.getByTestId(`checkbox-${name}-${value}`);
    const label = screen.getByTestId(`checkbox-label-${name}`);
    expect(input).toBeDisabled();
    expect(input).toBeChecked();
    expect(label).toHaveClass('peer-disabled:opacity-50');
  });
});
