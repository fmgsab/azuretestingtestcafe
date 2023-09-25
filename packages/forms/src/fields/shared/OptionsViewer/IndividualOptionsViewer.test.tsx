import { z } from 'zod';
import React, * as hooks from 'react';
import { render, screen, withFormWrapper, renderHook } from '@fmg/ui/src/test/test-utils';
import * as context from '@fmg/ui/src/context/ModelContext';

vi.mock('react', async () => {
  const actual = (await vi.importActual('react')) as object;
  return {
    ...actual,
    useRef: vi.fn().mockReturnValue({ current: ['Test Field'] }),
  };
});

import { IndividualOptionsViewer, useIsValidOption } from './IndividualOptionsViewer';
import * as defaults from '../../../hooks/useDefaultValue';

describe('fields/shared/IndividualOptionsViewer', () => {
  describe('useIsValidOption', () => {
    const name = 'fieldName';
    const value = 'Test Field';

    it.each`
      options    | expected
      ${[value]} | ${true}
      ${[]}      | ${false}
    `('should return correct value when options=$options', ({ options, expected }) => {
      const { result } = renderHook(() => useIsValidOption({ name, options }), {
        wrapper: withFormWrapper({ defaultValues: { [name]: value } }),
      });
      expect(result.current).toBe(expected);
    });

    it('should return true if no currValue', async () => {
      const { result } = renderHook(() => useIsValidOption({ name, options: [] }), {
        wrapper: withFormWrapper({ defaultValues: {} }),
      });
      expect(result.current).toBe(true);
    });

    const prevOptions = [{ value, label: value }];
    const newOption = { value: 'Field2' };
    it.each`
      options                        | expected
      ${prevOptions}                 | ${true}
      ${[...prevOptions, newOption]} | ${false}
      ${[newOption]}                 | ${false}
    `('should return correct value when options=$options and currValue is an object', ({ options, expected }) => {
      vi.spyOn(hooks, 'useRef').mockReturnValue({ current: prevOptions });
      const { result } = renderHook(() => useIsValidOption({ name, options }), {
        wrapper: withFormWrapper({ defaultValues: { [name]: { value } } }),
      });
      expect(result.current).toBe(expected);
    });
  });

  it('should render correctly', async () => {
    const schema = z.object({ option: z.string() });
    const useModelContextSpy = vi.spyOn(context, 'useModelContext');
    useModelContextSpy.mockReturnValue({ schema, uid: 0 });

    const useDefaultValueSpy = vi.spyOn(defaults, 'useDefaultValue');

    const { rerender } = render(<IndividualOptionsViewer name="option" options={['one', 'two', 'three']} />, {
      wrapper: withFormWrapper<z.infer<typeof schema>>({ defaultValues: { option: 'one' } }),
    });

    let radios = screen.queryAllByRole('radio');
    expect(radios).toHaveLength(6);

    expect(useDefaultValueSpy).toHaveBeenCalled();
    rerender(<IndividualOptionsViewer name="option" options={[{ name: 'option1', label: 'Option 1', value: 'Option 1' }]} />);
    radios = screen.queryAllByRole('radio');
    expect(radios).toHaveLength(2);
  });
});
