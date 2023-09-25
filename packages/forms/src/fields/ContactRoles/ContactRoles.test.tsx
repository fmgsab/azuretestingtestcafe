import { z } from 'zod';
import { render, screen, withFormWrapper } from '@fmg/ui/src/test/test-utils';
import * as context from '@fmg/ui/src/context/ModelContext';
import * as conditions from '../../hooks/useConditionalCriteria';

import { ContactRoles } from './ContactRoles';

describe('fields/Excess', () => {
  const schema = z.object({ excess: z.string() });
  const wrapper = withFormWrapper<z.infer<typeof schema>>({ defaultValues: {} });

  it('should render correctly', async () => {
    const useModelContextSpy = vi.spyOn(context, 'useModelContext');
    useModelContextSpy.mockReturnValue({ schema, uid: 0 });
    const useConditionalSpy = vi.spyOn(conditions, 'useConditionalCriteria');
    useConditionalSpy.mockReturnValue({
      defaultValue: undefined,
      fieldValues: ['vehicle', undefined, 'Comprehensive', undefined, '100000'],
      fields: ['itemType', 'itemSubtype', 'usage', 'Excess'],
      options: ['1% of SI', '500', '750', '1,000', '2,000', '3,000', '5,000', '10,000'],
      result: ['1% of SI', '500', '750', '1,000', '2,000', '3,000', '5,000', '10,000'],
    });

    const { rerender } = render(<ContactRoles as="list" />, { wrapper });
    const combobox = screen.queryByRole('combobox');
    expect(combobox).toBeInTheDocument();

    useConditionalSpy.mockReturnValue({
      defaultValue: undefined,
      fieldValues: ['vehicle', undefined, 'Comprehensive', undefined],
      fields: ['itemType', 'itemSubtype', 'usage', 'Excess'],
      options: [],
      result: [],
    });

    rerender(<ContactRoles as="list" />);
    expect(combobox).not.toBeInTheDocument();
  });
});
