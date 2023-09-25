import { renderHook, withFormWrapper } from '@fmg/ui/src/test/test-utils';
import * as saveField from '@fmg/ui/src/hooks/useSaveField';

import { useDefaultValue } from './useDefaultValue';

describe('hooks/useDefaultValue', () => {
  it.each`
    defaultValues
    ${{}}
    ${{ ['Hire Charges']: undefined }}
  `('should default for option type list correctly', async ({ defaultValues }) => {
    const saveFieldFn = vi.fn();
    vi.spyOn(saveField, 'useSaveField').mockReturnValue(saveFieldFn);

    const { result, rerender } = renderHook(
      () => useDefaultValue({ name: 'optionalCovers', options: [{ value: 'Hire Charges', label: 'Hire Charges' }], defaultValue: 'false' }),
      {
        wrapper: withFormWrapper({ defaultValues }),
      }
    );

    expect(saveFieldFn).toHaveBeenCalledWith(
      {
        name: expect.any(String),
        value: {
          'Hire Charges': 'false',
        },
      },
      expect.any(Boolean)
    );

    rerender();
    expect(result.current).toEqual({
      name: expect.any(String),
      value: {
        'Hire Charges': 'false',
      },
    });
  });

  it('should default for flat list correctly', async () => {
    const saveFieldFn = vi.fn();
    vi.spyOn(saveField, 'useSaveField').mockReturnValue(saveFieldFn);

    renderHook(() => useDefaultValue({ name: 'optionalCover', options: ['Hire Charges', 'Contract Use'], defaultValue: 'Hire Charges' }), {
      wrapper: withFormWrapper({ defaultValues: {} }),
    });

    expect(saveFieldFn).toHaveBeenCalledWith(
      {
        name: expect.any(String),
        value: 'Hire Charges',
      },
      expect.any(Boolean)
    );
  });
});
