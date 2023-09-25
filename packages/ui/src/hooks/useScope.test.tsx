import { renderHook, withFormWrapper } from '../test/test-utils';
import * as hooks from '../hooks/useResetFields';
import { useScope } from './useScope';

type TestData = {
  hasSharedArea: boolean;
  usageType: string;
  excessType: string;
  excess: string;
  numOtherAreas: number;
};

describe('useScope', () => {
  it('should return default when undefined', () => {
    const { result } = renderHook(() => useScope({}), {
      wrapper: withFormWrapper<TestData>({ defaultValues: { hasSharedArea: false } }),
    });
    expect(result.current.isVisible).toBe(true);
  });

  it.each`
    hasSharedArea
    ${true}
    ${false}
  `('should return isVisible $hasSharedArea for simple boolean', ({ hasSharedArea }) => {
    const { result } = renderHook(() => useScope({ source: 'hasSharedArea' }), {
      wrapper: withFormWrapper<TestData>({ defaultValues: { hasSharedArea } }),
    });
    expect(result.current.isVisible).toBe(hasSharedArea);
  });

  it.each`
    usageType     | isVisible
    ${'other'}    | ${true}
    ${'personal'} | ${false}
  `('should return isVisible $isVisible for value match', ({ usageType, isVisible }) => {
    const { result } = renderHook(() => useScope({ source: 'usageType', condition: 'other' }), {
      wrapper: withFormWrapper<TestData>({ defaultValues: { usageType } }),
    });
    expect(result.current.isVisible).toBe(isVisible);
  });

  const stdExcesses = [
    { label: '300', value: '300', name: '300' },
    { label: '500', value: '500', name: '500' },
    { label: '1,000', value: '1000', name: '1000' },
  ];

  const volExcesses = [
    { label: '450', value: '450', name: '450' },
    { label: '650', value: '650', name: '650' },
    { label: '1,150', value: '1150', name: '1150' },
  ];

  it.each`
    excessType     | options
    ${'standard'}  | ${stdExcesses}
    ${'voluntary'} | ${volExcesses}
  `('should return correct list for $excessType', ({ excessType, options }) => {
    const values = { standard: stdExcesses, voluntary: volExcesses };

    const { result } = renderHook(() => useScope({ source: 'excessType', values }), {
      wrapper: withFormWrapper<TestData>({ defaultValues: { excessType } }),
    });
    expect(result.current.isVisible).toEqual(true);
    expect(result.current.options).toEqual(options);
  });

  it.each`
    numOtherAreas | isVisible
    ${0}          | ${false}
    ${1}          | ${true}
    ${2}          | ${true}
  `('should return isVisible $isVisible for $numOtherAreas', ({ numOtherAreas, isVisible }) => {
    const { result } = renderHook(() => useScope({ source: 'numOtherAreas', condition: (val: number) => val > 0 }), {
      wrapper: withFormWrapper<TestData>({ defaultValues: { numOtherAreas } }),
    });
    expect(result.current.isVisible).toEqual(isVisible);
  });

  it.each`
    numOtherAreas | isEnabled
    ${0}          | ${false}
    ${1}          | ${true}
    ${2}          | ${true}
  `('should return isEnabled $isEnabled for $numOtherAreas', ({ numOtherAreas, isEnabled }) => {
    const { result } = renderHook(
      () => useScope({ controlState: 'enabled', source: 'numOtherAreas', condition: (val: number) => val > 0 }),
      {
        wrapper: withFormWrapper<TestData>({ defaultValues: { numOtherAreas } }),
      }
    );
    expect(result.current.isVisible).toEqual(true);
    expect(result.current.isEnabled).toEqual(isEnabled);
  });

  it.each`
    numOtherAreas | fieldsToReset        | calls
    ${0}          | ${['hasSharedArea']} | ${1}
    ${1}          | ${['hasSharedArea']} | ${0}
    ${2}          | ${[]}                | ${0}
    ${2}          | ${undefined}         | ${0}
  `('should invoke resetFields $calls times when fieldsToReset=$fieldsToReset', ({ numOtherAreas, fieldsToReset, calls }) => {
    const resetFn = vi.fn();
    vi.spyOn(hooks, 'useResetFields').mockReturnValue(resetFn);
    renderHook(() => useScope({ fieldsToReset, source: 'numOtherAreas', condition: (val: number) => val > 0 }), {
      wrapper: withFormWrapper<TestData>({ defaultValues: { numOtherAreas, hasSharedArea: true } }),
    });
    expect(resetFn).toHaveBeenCalledTimes(calls);
  });

  it.each`
    excess   | options        | isVisible
    ${'300'} | ${stdExcesses} | ${true}
    ${'450'} | ${stdExcesses} | ${false}
    ${'450'} | ${[]}          | ${true}
    ${'450'} | ${null}        | ${true}
  `('should only be visible when selected value of $excess is in valid range', async ({ excess, options, isVisible }) => {
    const { result } = renderHook(() => useScope({ source: 'excess', condition: excess, options }), {
      wrapper: withFormWrapper<TestData>({ defaultValues: { excess } }),
    });
    expect(result.current.isVisible).toEqual(isVisible);
  });
});
