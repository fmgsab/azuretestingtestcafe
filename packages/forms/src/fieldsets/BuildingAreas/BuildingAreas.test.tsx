import { z } from 'zod';
import { render, screen, withFormWrapper } from '@fmg/ui/src/test/test-utils';
import { asKey, asRequiredString, asYear, required } from 'models/src/schemas/schema';
import * as context from '@fmg/ui/src/context/ModelContext';

import * as conditions from '../../hooks/useConditionalCriteria';
import { BuildingAreas } from './BuildingAreas';

describe('fieldsets/BuildingAreas', () => {
  const schema = z.object({
    buildingAreas: z
      .object(
        {
          key: asKey(),
          type: asRequiredString(),
          year: asYear(),
          area: asRequiredString(5),
          description: asRequiredString(),
        },
        required
      )
      .array(),
  });

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

    render(<BuildingAreas />, {
      wrapper: withFormWrapper<z.infer<typeof schema>>({ defaultValues: { buildingAreas: [{}] } }),
    });
    const combobox = screen.queryAllByRole('textbox');
    expect(combobox.length).toBe(3);
  });

  it('should render alert message correctly', async () => {
    const area = '550';
    useConditionalSpy.mockReturnValue({ ...criteriaResults, extraFieldValues: [[{ area }]] });
    render(<BuildingAreas />, {
      wrapper: withFormWrapper<z.infer<typeof schema>>({ defaultValues: { buildingAreas: [{ area }] } }),
    });
    const alert = screen.queryByText(area, { exact: false });
    expect(alert).toBeInTheDocument();
  });
});
