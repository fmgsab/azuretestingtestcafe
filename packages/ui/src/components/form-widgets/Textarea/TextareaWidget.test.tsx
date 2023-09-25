import { act, composeStories, render } from '../../../test/test-utils';

import * as scope from '../../../hooks/useScope';
import * as formField from '../../../hooks/useFormField';
import * as stories from './TextareaWidget.stories';

const { Default } = composeStories(stories);

describe('form-widgets/Textarea', () => {
  it.each`
    isVisible | calledTimes
    ${false}  | ${0}
    ${true}   | ${1}
  `('should render depending on when in scope = $isVisible', async ({ isVisible, calledTimes }) => {
    const renderFn = vi.fn();
    vi.spyOn(scope, 'useScope').mockReturnValue({ options: [], isVisible, isEnabled: true });
    vi.spyOn(formField, 'useFormField').mockReturnValue({ render: renderFn });
    await act(() => render(<Default />));

    expect(renderFn).toHaveBeenCalledTimes(calledTimes);
  });
});
