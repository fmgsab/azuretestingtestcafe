import { z } from 'zod';
import { render, screen, withFormWrapper, renderHook } from '@fmg/ui/src/test/test-utils';
import * as context from '@fmg/ui/src/context/ModelContext';
import * as saveField from '@fmg/ui/src/hooks/useSaveField';
import { RadioGroupWidget } from '@fmg/ui';

import { OptionsViewer, useIsValidOption } from './OptionsViewer';

describe('fields/shared/OptionsViewer', () => {
  afterAll(() => {
    vi.clearAllMocks();
  });

  describe('useIsValidOption', () => {
    const name = 'fieldName';
    const value = 'Test Field';

    it('should return true if no currValue', async () => {
      const { result } = renderHook(() => useIsValidOption({ name, options: [] }), {
        wrapper: withFormWrapper({ defaultValues: {} }),
      });
      expect(result.current).toBe(true);
    });

    it.each`
      options                      | expected
      ${[{ value, label: value }]} | ${true}
      ${[value]}                   | ${true}
      ${[]}                        | ${false}
    `('should return correct value when options=$options', ({ options, expected }) => {
      const { result } = renderHook(() => useIsValidOption({ name, options }), {
        wrapper: withFormWrapper({ defaultValues: { [name]: value } }),
      });
      expect(result.current).toBe(expected);
    });
  });

  it('should render correctly', async () => {
    const schema = z.object({ option: z.string() });
    const useModelContextSpy = vi.spyOn(context, 'useModelContext');
    useModelContextSpy.mockReturnValue({ schema, uid: 0 });

    const { rerender } = render(<OptionsViewer name="option" as="list" options={['one', 'two', 'three']} />, {
      wrapper: withFormWrapper<z.infer<typeof schema>>({ defaultValues: { option: 'one' } }),
    });
    const listbox = screen.queryByRole('combobox');
    expect(listbox).toBeInTheDocument();

    rerender(<OptionsViewer name="option" as={RadioGroupWidget} options={['one', 'two', 'three']} />);
    let radios = screen.queryAllByRole('radio');
    expect(radios).toHaveLength(3);

    rerender(<OptionsViewer name="option" as="radio" options={['one', 'two', 'three']} />);
    radios = screen.queryAllByRole('radio');
    expect(radios).toHaveLength(3);

    rerender(<OptionsViewer name="option" as="radio" options={['one', 'two']} />);
    radios = screen.queryAllByRole('radio');
    expect(radios).toHaveLength(2);
  });

  it('should render checkbox correctly', async () => {
    const schema = z.object({ option: z.string().array() });
    const useModelContextSpy = vi.spyOn(context, 'useModelContext');
    useModelContextSpy.mockReturnValue({ schema, uid: 0 });

    const { rerender } = render(<OptionsViewer name="option" as="list" options={['one', 'two', 'three']} />, {
      wrapper: withFormWrapper<z.infer<typeof schema>>({ defaultValues: { option: ['one'] } }),
    });

    rerender(<OptionsViewer name="option" as="checkbox" options={['one', 'two', 'three', 'four']} />);
    const checkboxes = screen.queryAllByRole('checkbox');
    expect(checkboxes).toHaveLength(4);
  });

  it.each`
    isMulti  | currValue   | expected
    ${true}  | ${['four']} | ${[]}
    ${false} | ${'four'}   | ${''}
  `(`should set $expected correctly when not a valid option`, async ({ currValue, isMulti, expected }) => {
    const schema = z.object({ option: z.string().or(z.array(z.string())) });
    const useModelContextSpy = vi.spyOn(context, 'useModelContext');
    useModelContextSpy.mockReturnValue({ schema, uid: 0 });

    const saveFieldFn = vi.fn();
    const saveFieldSpy = vi.spyOn(saveField, 'useSaveField');
    saveFieldSpy.mockReturnValue(saveFieldFn);

    const name = 'option';

    render(<OptionsViewer name="option" as="list" isMulti={isMulti} options={['one', 'two', 'three']} />, {
      wrapper: withFormWrapper<z.infer<typeof schema>>({ defaultValues: { [name]: currValue } }),
    });
    const listbox = screen.queryByRole('combobox');
    expect(listbox).toBeInTheDocument();
    expect(saveFieldFn).toHaveBeenCalledWith({ name, value: expected });
  });

  it('should set default value to the form correctly', async () => {
    const schema = z.object({ option: z.string().or(z.array(z.string())) });
    const useModelContextSpy = vi.spyOn(context, 'useModelContext');
    useModelContextSpy.mockReturnValue({ schema, uid: 0 });

    const defaultValue = 'one';
    render(<OptionsViewer name="option" as="radio" options={['one', 'two', 'three']} defaultValue={defaultValue} />, {
      wrapper: withFormWrapper<z.infer<typeof schema>>({}),
    });

    const input = screen.queryByDisplayValue(defaultValue);
    expect(input).toBeChecked();
  });
});
