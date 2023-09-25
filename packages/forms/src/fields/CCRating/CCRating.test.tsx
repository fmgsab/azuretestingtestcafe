import { render, screen, withFormWrapper } from '@fmg/ui/src/test/test-utils';

import { CCRating } from './CCRating';
import * as context from '@fmg/ui/src/context/ModelContext';
import { z } from 'zod';

describe('fields/CCRating', () => {
  it('should render correctly', async () => {
    const useModelContextSpy = vi.spyOn(context, 'useModelContext');
    useModelContextSpy.mockReturnValue({ schema: z.object({}), uid: 0 });
    render(<CCRating />, {
      wrapper: withFormWrapper({ defaultValues: { itemSubtype: 'tractor' } }),
    });
    const textbox = screen.queryByRole('textbox');
    expect(textbox).toBeInTheDocument();
  });
});
