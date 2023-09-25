import React from 'react';
import { composeStories, render, screen, userEvent } from '../../../test/test-utils';

import * as stories from './Dropdown.stories';

const { Default, Disabled, Invalid, SearchableMulti, NoOptions, SearchableMultiFilled, CustomClass } = composeStories(stories);

describe('atoms/Dropdown', () => {
  it('should Default render correctly', async () => {
    const { rerender } = render(<Default />);

    const input = screen.getByRole('combobox');
    expect(input).toBeInTheDocument();

    expect(input).toHaveAttribute('aria-label');

    rerender(<Default label="" />);
    expect(input).toHaveAttribute('aria-label');
  });

  it('should Disabled render correctly', async () => {
    render(<Disabled />);

    const input = await screen.queryByRole('combobox');
    expect(input).not.toBeInTheDocument();
  });

  it('should NoOptions render correctly', async () => {
    const message = 'No available data';
    render(<NoOptions name="metric" noOptionsMessage={() => message} menuIsOpen />);

    const noOptionsMessage = await screen.getByText(message);
    expect(noOptionsMessage).toBeInTheDocument();
  });

  describe('styles', () => {
    const user = userEvent.setup();

    const options = [
      { value: '10', label: 'Kg' },
      { value: '20', label: 'g' },
    ];
    const placeholder = 'Select...';

    it('should style menu correctly', async () => {
      render(<Default options={options} placeholder={placeholder} />);

      const control = screen.getByRole('combobox');
      await user.click(control);

      const placeholderOption = screen.queryAllByText(placeholder);
      const option1 = screen.getByText(options[0].label);
      const option2 = screen.getByText(options[1].label);
      expect(placeholderOption.length).toBe(2);
      expect(option1).toBeInTheDocument();
      expect(option2).toBeInTheDocument();
    });

    it('should style menu for SearchableMulti correctly', async () => {
      const { container } = render(<SearchableMulti />);

      const valueContainer = container.querySelector('div[class$=ValueContainer]');
      expect(valueContainer).toHaveClass('-m-1.5');

      const placeholder = container.querySelector('div[class$=placeholder]');
      expect(placeholder).toHaveClass('m-1.5');
      const inputWrapper = container.querySelector('div[class$=Input]');
      expect(inputWrapper).toHaveClass('m-1.5');
    });

    it('should style menu for SearchableMultiFilled correctly', async () => {
      const { container } = render(<SearchableMultiFilled />);

      const valueContainer = container.querySelector('div[class$=ValueContainer]');
      expect(valueContainer).toHaveClass('-m-1.5');

      const removeButton = screen.getByRole('button').childNodes[0];
      expect(removeButton).toHaveClass('fill-field-multi-value-remove');
    });

    it('should style menu correctly when Invalid', async () => {
      const { container } = render(<Invalid options={options} placeholder={placeholder} menuIsOpen={true} />);

      const expectedErrorClass = '.border-error';
      expect(container.querySelectorAll(expectedErrorClass)).toBeDefined();

      const input = screen.getByRole('combobox');
      expect(input).toHaveAttribute('aria-invalid');
    });

    it.each`
      value         | selectedOptionLabel
      ${options[0]} | ${options[0].label}
      ${options[1]} | ${options[1].label}
      ${''}         | ${placeholder}
    `('should style selected option $selectedOptionLabel correctly', async ({ value, selectedOptionLabel }) => {
      render(<Default options={options} placeholder={placeholder} value={value} />);

      const selectedOption = screen.getByText(selectedOptionLabel);
      expect(selectedOption).toBeInTheDocument();
    });

    it('should show correct default option', async () => {
      const user = userEvent.setup();
      const { container } = render(<CustomClass />);

      const expectedErrorClass = '.w-full';
      expect(container.querySelectorAll(expectedErrorClass)).toBeDefined();

      await user.tab();
      await user.keyboard('{ArrowDown}');

      const options = container.querySelectorAll('div[id*=-option-]');
      expect(options[1].className).toContain('active:bg-field-bg');
      expect(options[1].className).not.toContain(' bg-field-bg ');

      await user.keyboard('{ArrowDown}');

      expect(options[1].className).toContain('active:bg-field-bg');
      expect(options[1].className).toContain(' bg-field-bg ');
    });
  });
});
