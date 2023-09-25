import { composeStories, render, screen, userEvent } from '../../../test/test-utils';
import * as scope from '../../../hooks/useScope';
import * as formField from '../../../hooks/useFormField';
import * as stories from './TextInputWidget.stories';
import { act } from '@testing-library/react';

const { Default, Required, Alpha, AlphaNumeric } = composeStories(stories);

describe('form-widgets/Text', () => {
  // Basically 100% covered in the primary render hook (useFormFieldGroup), so not repeating the same tests in other widgets
  describe('test functionality', () => {
    it('should function Default correctly', async () => {
      const user = userEvent.setup();
      await act(() => render(<Default />));

      const input = screen.getByRole('textbox');
      await user.click(input);
      await user.tab();
      expect(input).not.toBeInvalid();
    });

    it('should function Required correctly', async () => {
      const user = userEvent.setup();
      await act(() => render(<Required />));

      const asterisk = screen.getByTestId('required');
      expect(asterisk).toBeInTheDocument();

      const input = screen.getByRole('textbox');

      await user.click(input);
      await user.tab();
      expect(input).toBeInvalid();
    });

    it('should function AlphaOnly correctly', async () => {
      const user = userEvent.setup();
      await act(() => render(<Alpha />));

      const input = screen.getByTestId('text-input-firstName');

      await user.click(input);
      await user.keyboard('test');
      await user.tab();
      expect(input).not.toBeInvalid();

      await user.click(input);
      await user.keyboard('123');
      await user.tab();
      expect(input).toBeInvalid();
    });

    it('should function AlphaNumeric correctly', async () => {
      const user = userEvent.setup();
      await act(() => render(<AlphaNumeric />));

      const input = screen.getByTestId('text-input-firstName');

      await user.click(input);
      await user.keyboard('abc 123');
      await user.tab();
      expect(input).toBeValid();

      await user.click(input);
      await user.keyboard('test * -');
      await user.tab();
      expect(input).toBeInvalid();
    });
  });

  it.each`
    isVisible | calledTimes
    ${false}  | ${0}
    ${true}   | ${1}
  `('should render depending on when in scope = $isVisible', async ({ isVisible, calledTimes }) => {
    const renderFn = vi.fn();
    vi.spyOn(scope, 'useScope').mockReturnValueOnce({ options: [], isVisible, isEnabled: true });
    vi.spyOn(formField, 'useFormField').mockReturnValueOnce({ render: renderFn });
    await act(() => render(<Default />));

    expect(renderFn).toHaveBeenCalledTimes(calledTimes);
  });
});
