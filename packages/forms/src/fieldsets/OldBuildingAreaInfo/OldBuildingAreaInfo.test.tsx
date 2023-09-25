import { z } from 'zod';
import { buildingAreaTypes } from 'models';
import { render, screen, withFormWrapper } from '@fmg/ui/src/test/test-utils';
import { asKey, asOptionalShortText, asOptionalString, asRange, asRequiredString, asYear } from 'models/src/schemas/schema';
import * as context from '@fmg/ui/src/context/ModelContext';

import { OldBuildingAreaInfo } from './OldBuildingAreaInfo';

describe('fieldsets/OldBuildingAreaInfo', () => {
  const schema = z.object({
    buildingAreas: z
      .object({
        key: asKey(),
        type: asRequiredString(),
        year: asYear(),
        area: asRange(1, 9999),
        description: asOptionalShortText(),
      })
      .array(),
    rewired: asOptionalString(),
    wiringCert: asOptionalString(),
    reroofed: asOptionalString(),
    historicPlace: asOptionalString(),
    scrimPresent: asOptionalString(),
  });

  const useModelContextSpy = vi.spyOn(context, 'useModelContext');
  useModelContextSpy.mockReturnValue({ schema, uid: 0 });

  it('should render correctly', async () => {
    render(<OldBuildingAreaInfo />, {
      wrapper: withFormWrapper({ defaultValues: { buildingAreas: [{ type: buildingAreaTypes.domesticUnit, year: '1939', area: '100' }] } }),
    });
    const radio = screen.queryAllByRole('radio');
    expect(radio.length).toBe(9);
  });
});
