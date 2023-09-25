import { act, renderHook, withFormWrapper } from '../test/test-utils';

vi.mock('./useSetValueRecursively', async () => {
  const actual = (await vi.importActual('./useSetValueRecursively')) as object;
  return { ...actual };
});

vi.mock('react-hook-form', async () => {
  const actual = (await vi.importActual('react-hook-form')) as object;
  return { ...actual };
});

import * as setValueUtil from './useSetValueRecursively';
import * as hookForm from 'react-hook-form';

describe('useSetValueRecursively', () => {
  const setValueFn = vi.fn();
  const watchFn = vi.fn();

  it('should set value to form for non nested structure', async () => {
    watchFn.mockReturnValue('1233456');

    // eslint-disable-next-line
    // @ts-ignore
    vi.spyOn(hookForm, 'useFormContext').mockReturnValue({ setValue: setValueFn, watch: watchFn });
    const { result } = renderHook(setValueUtil.useSetValueRecursively, {
      wrapper: withFormWrapper({ defaultValues: { cost: '1233456' } }),
    });
    expect(result.current).toEqual(expect.any(Function));

    act(() => result.current('cost', '500'));

    expect(setValueFn).toHaveBeenNthCalledWith(1, 'cost', '500');
  });

  it('should set value to form for 1 level deep', async () => {
    watchFn.mockReturnValueOnce({ first: 1234, second: 2345 });
    watchFn.mockReturnValueOnce(1234);
    watchFn.mockReturnValueOnce(2345);

    // eslint-disable-next-line
    // @ts-ignore
    vi.spyOn(hookForm, 'useFormContext').mockReturnValue({ setValue: setValueFn, watch: watchFn });
    const { result } = renderHook(setValueUtil.useSetValueRecursively, {
      wrapper: withFormWrapper({ defaultValues: { cost: { first: 1234, second: 2345 } } }),
    });
    expect(result.current).toEqual(expect.any(Function));

    act(() => result.current('cost', undefined));
    act(() => result.current('cost--', undefined));

    expect(setValueFn).toHaveBeenNthCalledWith(2, 'cost.first', undefined);
    expect(setValueFn).toHaveBeenNthCalledWith(3, 'cost.second', undefined);
    expect(setValueFn).toHaveBeenNthCalledWith(4, 'cost--', undefined);
  });

  it('should set value to form for more nested', async () => {
    watchFn.mockReturnValueOnce({ first: { principle: '123456', interest: '25' }, second: '2345' });
    watchFn.mockReturnValueOnce({ principle: '123456', interest: '25' });
    watchFn.mockReturnValueOnce('2345');
    watchFn.mockReturnValueOnce('123456');
    watchFn.mockReturnValueOnce('25');

    // eslint-disable-next-line
    // @ts-ignore
    vi.spyOn(hookForm, 'useFormContext').mockReturnValue({ setValue: setValueFn, watch: watchFn });
    const { result } = renderHook(setValueUtil.useSetValueRecursively, {
      wrapper: withFormWrapper({}),
    });
    expect(result.current).toEqual(expect.any(Function));

    act(() => result.current('cost', 0));

    expect(setValueFn).toHaveBeenNthCalledWith(5, 'cost.first.principle', 0);
    expect(setValueFn).toHaveBeenNthCalledWith(6, 'cost.first.interest', 0);
    expect(setValueFn).toHaveBeenNthCalledWith(7, 'cost.second', 0);
  });
});
