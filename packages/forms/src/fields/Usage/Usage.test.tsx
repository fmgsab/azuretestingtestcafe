import { z } from 'zod';
import { render, screen, withFormWrapper } from '@fmg/ui/src/test/test-utils';
import * as context from '@fmg/ui/src/context/ModelContext';
import * as conditions from '../../hooks/useConditionalCriteria';

import { Usage } from './Usage';

describe('fields/Usage', () => {
  it.each`
    itemType          | question
    ${'vehicle'}      | ${'Vehicle usage'}
    ${'farmBuilding'} | ${'Usage'}
  `('should render correctly', async ({ itemType, question }) => {
    const useModelContextSpy = vi.spyOn(context, 'useModelContext');
    useModelContextSpy.mockReturnValue({ schema: z.object({}), uid: 0 });
    const useConditionalSpy = vi.spyOn(conditions, 'useConditionalCriteria');
    useConditionalSpy.mockReturnValue({
      defaultValue: undefined,
      fieldValues: [itemType, undefined, undefined, undefined],
      fields: ['itemType', 'itemSubtype', 'usage', 'coverage'],
      options: ['Private'],
      result: ['Private'],
      extraFieldValues: [],
    });

    render(<Usage />, { wrapper: withFormWrapper({ defaultValues: { itemType } }) });
    expect(screen.queryAllByRole('radio')[0]).toBeInTheDocument();
    expect(screen.queryByText(question)).toBeInTheDocument();
  });
});
