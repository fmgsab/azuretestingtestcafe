import { z } from 'zod';
import { render, screen, withFormWrapper } from '@fmg/ui/src/test/test-utils';
import { asRequiredString, asSet, asString } from 'models/src/schemas/schema';
import * as context from '@fmg/ui/src/context/ModelContext';

import { FireProtection } from './FireProtection';

describe('fieldsets/FireProtection', () => {
  const schema = z.object({
    hasFireProtection: asRequiredString(),
    fireProtection: asSet(asString()).nullish(),
  });

  const useModelContextSpy = vi.spyOn(context, 'useModelContext');
  useModelContextSpy.mockReturnValue({ schema, uid: 0 });

  it('should render correctly', async () => {
    render(<FireProtection />, {
      wrapper: withFormWrapper({ defaultValues: {} }),
    });
    const radio = screen.queryAllByRole('radio');
    expect(radio.length).toBe(2);
    // const checks = screen.queryAllByRole('checkbox');
    // expect(checks.length).toBe(2);
  });
});
