import { z } from 'zod';
import { render, screen, withFormWrapper } from '@fmg/ui/src/test/test-utils';
import { asOptionalShortText, asOptionalString, asRequiredString, asSet, asString } from 'models/src/schemas/schema';
import * as context from '@fmg/ui/src/context/ModelContext';

import { CommercialSecurity } from './CommercialSecurity';
import { occupancies } from 'models';

describe('fieldsets/CommercialSecurity', () => {
  const schema = z.object({
    occupancy: asRequiredString(),
    hasSecurityFeatures: asOptionalString(),
    securityQuestions: asSet(asString()).nullish(),
    otherSecurityDetails: asOptionalShortText(),
  });

  const useModelContextSpy = vi.spyOn(context, 'useModelContext');
  useModelContextSpy.mockReturnValue({ schema, uid: 0 });

  it('should render correctly', async () => {
    render(<CommercialSecurity />, {
      wrapper: withFormWrapper({ defaultValues: { occupancy: occupancies.ownerOccupied, hasSecurityFeatures: 'Yes' } }),
    });
    const radio = screen.queryAllByRole('radio');
    expect(radio.length).toBe(2);
    // const checks = screen.queryAllByRole('checkbox');
    // expect(checks.length).toBe(2);
  });

  it('should render correctly', async () => {
    render(<CommercialSecurity />, {
      wrapper: withFormWrapper({ defaultValues: { occupancy: occupancies.tenanted } }),
    });
    const radio = screen.queryAllByRole('radio');
    expect(radio.length).toBe(0);
  });
});
