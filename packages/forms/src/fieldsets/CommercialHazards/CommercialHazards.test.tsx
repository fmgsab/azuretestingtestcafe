import { z } from 'zod';
import { render, screen, withFormWrapper } from '@fmg/ui/src/test/test-utils';
import { asOptionalShortText, asRequiredString, asSet, asString } from 'models/src/schemas/schema';
import * as context from '@fmg/ui/src/context/ModelContext';

import { CommercialHazards } from './CommercialHazards';

describe('fieldsets/CommercialHazards', () => {
  const schema = z.object({
    hasHazards: asRequiredString(),
    hazards: asSet(asString()).nullish(),
    otherHazardDetails: asOptionalShortText(),
  });

  const useModelContextSpy = vi.spyOn(context, 'useModelContext');
  useModelContextSpy.mockReturnValue({ schema, uid: 0 });

  it('should render correctly', async () => {
    render(<CommercialHazards />, {
      wrapper: withFormWrapper({ defaultValues: {} }),
    });
    const radio = screen.queryAllByRole('radio');
    expect(radio.length).toBe(2);
    // const checks = screen.queryAllByRole('checkbox');
    // expect(checks.length).toBe(2);
  });
});
