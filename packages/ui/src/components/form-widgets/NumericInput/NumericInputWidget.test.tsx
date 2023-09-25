import { composeStories, render, screen } from '../../../test/test-utils';
import * as stories from './NumericInputWidget.stories';
import { act } from '@testing-library/react';
import * as scope from '../../../hooks/useScope';
import * as formField from '../../../hooks/useFormFieldGroup';

const { Default } = composeStories(stories);

describe('form-widgets/Text Input Numeric', () => {
  it('should function Default correctly', async () => {
    await act(() => render(<Default />));
    expect(screen.getByText('$')).toBeInTheDocument();
  });

  it.each`
    isVisible | calledTimes
    ${false}  | ${0}
    ${true}   | ${1}
  `('should render depending on when in scope = $isVisible', async ({ isVisible, calledTimes }) => {
    const renderFn = vi.fn();
    vi.spyOn(scope, 'useScope').mockReturnValueOnce({ options: [], isVisible, isEnabled: true });
    vi.spyOn(formField, 'useFormFieldGroup').mockReturnValueOnce({ render: renderFn });
    await act(() => render(<Default />));

    expect(renderFn).toHaveBeenCalledTimes(calledTimes);
  });
});
