import { composeStories, render, screen, userEvent } from '../../../test/test-utils';
import * as stories from './DatePickerWidget.stories';
import { act } from '@testing-library/react';
import * as scope from '../../../hooks/useScope';
import * as formField from '../../../hooks/useFormField';

const { Range22to24 } = composeStories(stories);

describe('form-widgets/Datepicker widget', () => {
  it('should render and tab correctly', async () => {
    const user = userEvent.setup();
    await act(() => render(<Range22to24 />));

    const input = screen.getByLabelText('startDate');
    expect(input).toBeInTheDocument();

    await user.tab();
    expect(input).toHaveFocus();
    await user.keyboard('{Enter}');
    const errorMessage = screen.queryByText('Required');
    expect(errorMessage).toBeDefined();
  });

  it.each`
    isVisible | calledTimes
    ${false}  | ${0}
    ${true}   | ${1}
  `('should render depending on in scope = $isVisible', async ({ isVisible, calledTimes }) => {
    const renderFn = vi.fn();
    vi.spyOn(scope, 'useScope').mockReturnValue({ isVisible, isEnabled: true });
    vi.spyOn(formField, 'useFormField').mockReturnValue({ render: renderFn });
    await act(() => render(<Range22to24 />));

    expect(renderFn).toHaveBeenCalledTimes(calledTimes);
  });
});
