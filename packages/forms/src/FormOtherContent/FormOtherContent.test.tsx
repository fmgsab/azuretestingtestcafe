import { z } from 'zod';
import { render, screen, withFormWrapper } from '@fmg/ui/src/test/test-utils';
import * as context from '@fmg/ui/src/context/ModelContext';
import * as conditions from '../../src/hooks/useConditionalCriteria';
import { FormOtherContent } from './FormOtherContent';
import { otherContent as model } from 'models';

describe('forms/OtherContent', () => {
  const schema = model.schema;

  const criteriaResults = {
    defaultValue: undefined,
    fieldValues: ['house', 'Dwelling', '', ''],
    fields: ['itemType', 'itemSubtype', 'usage', 'coverType'],
    options: [{ value: 'Domestic unit', label: 'Domestic unit' }],
    result: [{ value: 'Domestic unit', label: 'Domestic unit' }],
    extraFieldValues: [],
  };

  const useModelContextSpy = vi.spyOn(context, 'useModelContext');
  useModelContextSpy.mockReturnValue({ schema, uid: 0 });
  const useConditionalSpy = vi.spyOn(conditions, 'useConditionalCriteria');

  it('should render correctly', async () => {
    useConditionalSpy.mockReturnValue(criteriaResults);

    render(<FormOtherContent uid="292f6d16-54d9-467b-bb4c-531cba90dd2f" />, {
      wrapper: withFormWrapper<model.FormValues>({ defaultValues: {} }),
    });
    const combobox = screen.queryAllByRole('textbox');
    expect(combobox.length).toBe(3);
  });

  it('should render alert message correctly', async () => {
    const area = '550';
    useConditionalSpy.mockReturnValue({ ...criteriaResults, extraFieldValues: [[{ area }]] });
    render(<FormOtherContent uid="292f6d16-54d9-467b-bb4c-531cba90dd2f" />, {
      wrapper: withFormWrapper<model.FormValues>({ defaultValues: {} }),
    });
    const alert = screen.queryByText(area, { exact: false });
    expect(alert).toBeInTheDocument();
  });
});
