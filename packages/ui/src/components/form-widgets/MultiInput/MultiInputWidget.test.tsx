import { act, composeStories, render, withFormWrapper } from '../../../test/test-utils';

import * as scope from '../../../hooks/useScope';
import * as formField from '../../../hooks/useFormFieldGroup';
import * as scopeContext from '../../../context/ScopeContext';
import * as stories from './MultiInputWidget.stories';

import { MultiInputWidget } from './MultiInputWidget';
import { RadioGroupInput } from '../RadioGroup/RadioGroupWidget';
import TextInput from '../../atoms/TextInput/TextInput';

const { Default } = composeStories(stories);

describe('form-widgets/MultiInput', () => {
  it.each`
    isVisible | calledTimes
    ${false}  | ${0}
    ${true}   | ${1}
  `('should render depending on when in scope = $isVisible', async ({ isVisible, calledTimes }) => {
    const renderFn = vi.fn();
    vi.spyOn(scope, 'useScope').mockReturnValue({ options: [], isVisible, isEnabled: true });
    vi.spyOn(formField, 'useFormFieldGroup').mockReturnValue({ render: renderFn });
    await act(() => render(<Default />));

    expect(renderFn).toHaveBeenCalledTimes(calledTimes);
  });

  it.each`
    isEnabled
    ${false}
    ${true}
  `('should render depending on when scope enabled = $isEnabled', async ({ isEnabled }) => {
    const useScopeContextSpy = vi.spyOn(scopeContext, 'useScopeContext');
    useScopeContextSpy.mockReturnValue({ highlight: true, isEnabled, isExpanded: true, source: 'source', inline: false });

    const useFormFieldGroupSpy = vi.spyOn(formField, 'useFormFieldGroup').mockReturnValue({ render: vi.fn() });

    await act(() =>
      render(
        <MultiInputWidget name="">
          <RadioGroupInput name="source" />
          <TextInput name="target" />
        </MultiInputWidget>,
        { wrapper: withFormWrapper({ defaultValues: {} }) }
      )
    );
    expect(useFormFieldGroupSpy).toHaveBeenCalledWith(
      expect.objectContaining({ fields: expect.arrayContaining([expect.objectContaining({ disabled: !isEnabled })]) })
    );
  });
});
