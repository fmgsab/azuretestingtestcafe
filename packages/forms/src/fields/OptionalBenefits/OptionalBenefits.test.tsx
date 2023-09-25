import { z } from 'zod';
import { render, screen, withFormWrapper } from '@fmg/ui/src/test/test-utils';
import { asString } from 'models/src/schemas/schema';
import * as context from '@fmg/ui/src/context/ModelContext';

import * as conditions from '../../hooks/useConditionalCriteria';
import * as defaults from '../../hooks/useDefaultValue';
import { OptionalBenefits } from './OptionalBenefits';

describe('fields/OptionalBenefits', () => {
  const schema = z.object({
    optionalCoverType: z
      .set(asString())
      .or(
        z.object({
          hasHireCharges: asString(),
          hasContractUse: asString(),
          hasDefinedEvents: asString(),
          hasAdditionalCosts: asString(),
          hasHoists: asString(),
        })
      )
      .or(z.array(asString())),
  });

  const useModelContextSpy = vi.spyOn(context, 'useModelContext');
  useModelContextSpy.mockReturnValue({ schema, uid: 0 });
  const useConditionalSpy = vi.spyOn(conditions, 'useConditionalCriteria');
  useConditionalSpy.mockReturnValue({
    defaultValue: undefined,
    fieldValues: ['vehicle', 'Truck', 'Private', 'Comprehensive'],
    fields: ['itemType', 'itemSubtype', 'usage', 'coverType'],
    options: [{ value: 'Hire Charges', label: 'Hire Charges' }],
    result: [{ value: 'Hire Charges', label: 'Hire Charges' }],
    extraFieldValues: [],
  });

  const useDefaultValueSpy = vi.spyOn(defaults, 'useDefaultValue');

  it('should render correctly', async () => {
    const { rerender } = render(<OptionalBenefits />, {
      wrapper: withFormWrapper<z.infer<typeof schema>>({ defaultValues: {} }),
    });
    const radios = screen.queryAllByRole('radio');
    expect(radios.length).toBe(2);
    expect(radios[0]).not.toBeChecked();
    expect(radios[1]).toBeChecked();
    expect(useDefaultValueSpy).toHaveBeenCalledTimes(2);

    rerender(<OptionalBenefits as="list" />);
    const combobox = screen.queryAllByRole('combobox');
    expect(combobox.length).toBe(1);
    expect(useDefaultValueSpy).toHaveBeenCalledTimes(2);
  });
});
