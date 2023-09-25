import { z } from 'zod';
import { render, screen, withFormWrapper } from '@fmg/ui/src/test/test-utils';
import * as context from '@fmg/ui/src/context/ModelContext';
import * as conditions from '../../hooks/useConditionalCriteria';

import { CoverType } from './CoverType';

describe('fields/CoverType', () => {
  it('should render correctly', async () => {
    const useModelContextSpy = vi.spyOn(context, 'useModelContext');
    useModelContextSpy.mockReturnValue({ schema: z.object({}), uid: 0 });
    const useConditionalSpy = vi.spyOn(conditions, 'useConditionalCriteria');
    useConditionalSpy.mockReturnValue({
      defaultValue: undefined,
      fieldValues: ['vehicle', undefined, undefined, undefined],
      fields: ['itemType', 'itemSubtype', 'usage', 'coverType'],
      options: ['Comprehensive'],
      result: ['Comprehensive'],
      extraFieldValues: [],
    });

    render(<CoverType />, { wrapper: withFormWrapper({ defaultValues: {} }) });
    const radios = screen.queryAllByRole('radio');
    expect(radios.length).toBe(1);
  });
});
