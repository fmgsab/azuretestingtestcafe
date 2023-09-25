import { z } from 'zod';
import { render, screen, withFormWrapper } from '@fmg/ui/src/test/test-utils';
import * as context from '@fmg/ui/src/context/ModelContext';

import { ConditionalQuestionSI } from './ConditionalQuestionSI';

describe('fields/ConditionalQuestionSI', () => {
  it.each`
    bos                         | expected
    ${'Functional Replacement'} | ${'Functional Replacement Value'}
    ${'Some other Replacement'} | ${'Nominated Replacement Value'}
  `('should render correctly', async ({ bos, expected }) => {
    const useModelContextSpy = vi.spyOn(context, 'useModelContext');
    useModelContextSpy.mockReturnValue({ schema: z.object({ basisOfSettlement: z.string() }), uid: 0 });

    render(<ConditionalQuestionSI />, { wrapper: withFormWrapper({ defaultValues: { basisOfSettlement: bos } }) });

    const label = await screen.findByText(expected);
    expect(label).toBeDefined();
  });
});
