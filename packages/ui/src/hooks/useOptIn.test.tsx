import { renderHook, withFormWrapper } from '../test/test-utils';

import { useOptIn } from './useOptIn';
import * as saveFieldUtil from './useSaveField';
import * as setValueUtil from './useSetValueRecursively';

describe('useOptIn', () => {
  const name = 'cost';
  const optedFor = 'hasCost';

  const saveFieldFn = vi.fn();
  const setValueFn = vi.fn();
  vi.spyOn(saveFieldUtil, 'useSaveField').mockReturnValue(saveFieldFn);
  vi.spyOn(setValueUtil, 'useSetValueRecursively').mockReturnValue(setValueFn);

  it('should not evaluate opt in/out', async () => {
    const { result } = renderHook(() => useOptIn({ name }), {
      wrapper: withFormWrapper({ defaultValues: { hasCost: false, cost: { first: 1234, second: 2345 } } }),
    });

    expect(result.current).toEqual(expect.objectContaining({ optedIn: false, optedOut: false }));
    expect(saveFieldFn).not.toHaveBeenCalled();
    expect(setValueFn).not.toHaveBeenCalled();
  });

  it('should evaluate opt in', async () => {
    const hasCost = true;
    const { result } = renderHook(() => useOptIn({ name, optedFor }), {
      wrapper: withFormWrapper({ defaultValues: { hasCost, cost: { first: 1234, second: 2345 } } }),
    });

    expect(result.current).toEqual(expect.objectContaining({ optedIn: hasCost, optedOut: !hasCost }));
    expect(saveFieldFn).toHaveBeenNthCalledWith(1, { name: optedFor, value: true }, true);
  });

  it('should evaluate opt out', async () => {
    const hasCost = false;
    const { result } = renderHook(() => useOptIn({ name, optedFor }), {
      wrapper: withFormWrapper({ defaultValues: { hasCost: false, cost: { first: 1234, second: 2345 } } }),
    });

    expect(result.current).toEqual(expect.objectContaining({ optedIn: hasCost, optedOut: !hasCost }));
    expect(saveFieldFn).toHaveBeenNthCalledWith(2, { name, value: '' });
    expect(saveFieldFn).toHaveBeenNthCalledWith(3, { name: optedFor, value: false }, true);
    expect(setValueFn).toHaveBeenCalledWith(name, '');
  });
});
