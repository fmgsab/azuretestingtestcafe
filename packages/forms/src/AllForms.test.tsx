import { z } from 'zod';
import { render, withFormWrapper } from '@fmg/ui/src/test/test-utils';
import * as context from '@fmg/ui/src/context/ModelContext';

import { FormHouse } from './FormHouse/FormHouse';
import { FormVehicle } from './FormVehicle/FormVehicle';
import { FormKeyInfo } from './FormKeyInfo/FormKeyInfo';
import { FormWatercraft } from './FormWatercraft/FormWatercraft';

describe('all forms', () => {
  const schema = z.object({});
  const useModelContextSpy = vi.spyOn(context, 'useModelContext');
  useModelContextSpy.mockReturnValue({ schema, uid: 0 });

  it.each`
    Form
    ${FormHouse}
    ${FormVehicle}
    ${FormKeyInfo}
    ${FormWatercraft}
  `('should render $Form.name correctly', async ({ Form }) => {
    render(<Form uid={1} />, {
      wrapper: withFormWrapper<z.infer<typeof schema>>({ defaultValues: {} }),
    });
  });
});
