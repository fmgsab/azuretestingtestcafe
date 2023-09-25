import { z } from 'zod';
import { render, screen, withFormWrapper } from '@fmg/ui/src/test/test-utils';
import * as context from '@fmg/ui/src/context/ModelContext';
import * as conditions from '../../hooks/useConditionalCriteria';

import { ItemSubtype } from './ItemSubtype';

describe('fields/ItemSubtype', () => {
  it.each`
    itemType                    | question
    ${'vehicle'}                | ${'Vehicle type'}
    ${'watercraft'}             | ${'Boat type'}
    ${'house'}                  | ${'Type'}
    ${'content'}                | ${'Contents type'}
    ${'farmBuilding'}           | ${'Building Type'}
    ${'commercialBuilding'}     | ${'Building Type'}
  `('should render correctly', async ({ itemType, question }) => {
    const useModelContextSpy = vi.spyOn(context, 'useModelContext');
    useModelContextSpy.mockReturnValue({ schema: z.object({}), uid: 0 });
    const useConditionalSpy = vi.spyOn(conditions, 'useConditionalCriteria');
    useConditionalSpy.mockReturnValue({
      defaultValue: undefined,
      fieldValues: [itemType, undefined, undefined, undefined],
      fields: ['itemType', 'itemSubtype', 'usage', 'coverage'],
      options: ['Comprehensive'],
      result: ['Comprehensive'],
      extraFieldValues: [],
    });

    render(<ItemSubtype />, { wrapper: withFormWrapper({ defaultValues: { itemType } }) });
    expect(screen.queryByRole('combobox')).toBeInTheDocument();
    expect(screen.queryByText(question)).toBeInTheDocument();
  });
});
