import { z } from 'zod';
import { render, screen, withFormWrapper } from '@fmg/ui/src/test/test-utils';
import * as context from '@fmg/ui/src/context/ModelContext';
import * as conditions from '../../hooks/useConditionalCriteria';

import { EngineType } from './EngineType';

describe('fields/EngineType', () => {
  it('should render correctly', async () => {
    const useModelContextSpy = vi.spyOn(context, 'useModelContext');
    useModelContextSpy.mockReturnValue({ schema: z.object({}), uid: 0 });
    const useConditionalSpy = vi.spyOn(conditions, 'useConditionalCriteria');
    useConditionalSpy.mockReturnValue({
      defaultValue: undefined,
      fieldValues: ['vehicle', 'Motorbike', undefined, undefined],
      fields: ['itemType', 'itemSubtype', 'usage', 'coverType'],
      options: ['4 Stroke', '2 Stroke', 'Electric', 'Other'],
      result: ['4 Stroke', '2 Stroke', 'Electric', 'Other'],
      extraFieldValues: [],
    });

    render(<EngineType />, { wrapper: withFormWrapper({ defaultValues: {} }) });
    const combobox = screen.queryByRole('combobox');
    expect(combobox).toBeInTheDocument();
  });
});
