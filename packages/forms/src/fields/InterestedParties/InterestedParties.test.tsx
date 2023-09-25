import { z } from 'zod';
import { render, screen, withFormWrapper } from '@fmg/ui/src/test/test-utils';
import * as context from '@fmg/ui/src/context/ModelContext';
import * as conditions from '../../hooks/useConditionalCriteria';

import { InterestedParties } from './InterestedParties';

describe('fields/InterestedParties', () => {
  it('should render correctly', async () => {
    const schema = z.object({ InterestedParties: z.string() });
    const useModelContextSpy = vi.spyOn(context, 'useModelContext');
    useModelContextSpy.mockReturnValue({ schema, uid: 0 });
    const useConditionalSpy = vi.spyOn(conditions, 'useConditionalCriteria');
    useConditionalSpy.mockReturnValue({
      defaultValue: undefined,
      fieldValues: ['vehicle', undefined, undefined, undefined],
      fields: ['itemType', 'itemSubtype', 'usage', 'coverType'],
      options: ['Toyota Finance', 'Motor Trade Finance', 'Marac Finance'],
      result: ['Toyota Finance', 'Motor Trade Finance', 'Marac Finance'],
      extraFieldValues: [],
    });

    render(<InterestedParties />, {
      wrapper: withFormWrapper<z.infer<typeof schema>>({ defaultValues: {} }),
    });
    const combobox = screen.queryByRole('combobox');
    expect(combobox).toBeInTheDocument();
  });
});
