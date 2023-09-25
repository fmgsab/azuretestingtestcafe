// eslint-disable-next-line
// @ts-nocheck
import { renderHook, withFormWrapper } from '../test/test-utils';
import * as saveField from './useSaveField';

import { HandleEventProps, useFieldEvents } from './useFieldEvents';
describe('hooks/useFieldEvents', () => {
  const name = 'name';
  const label = 'Test';
  const value = 'test';

  const fieldOnChangeFn = vi.fn();
  const fieldPropsOnChangeFn = vi.fn();
  const propsOnChangeFn = vi.fn();
  const fieldOnBlurFn = vi.fn();

  const field: HandleEventProps['field'] = { name, value, onChange: fieldOnChangeFn, onBlur: fieldOnBlurFn };

  const eventMock = { target: { value } };

  it('should render hook and invoke functions correctly', async () => {
    const saveFieldFn = vi.fn();
    vi.spyOn(saveField, 'useSaveField').mockReturnValue(saveFieldFn);

    const { result } = renderHook(() => useFieldEvents({ onChange: propsOnChangeFn }), {
      wrapper: withFormWrapper({ defaultValues: {} }),
    });

    expect(result.current).toEqual([expect.any(Function), expect.any(Function)]);
    const [handleChange, handleBlur] = result.current;
    const onChange = handleChange({ field, saveOnChange: false, onChange: fieldPropsOnChangeFn });
    const onBlur = handleBlur({ field, saveOnChange: false });

    expect(onChange).toEqual(expect.any(Function));
    expect(onBlur).toEqual(expect.any(Function));

    onChange({ label, value });
    expect(fieldOnChangeFn).toHaveBeenCalledWith(value);
    expect(saveFieldFn).not.toHaveBeenCalled();

    onChange(eventMock);
    expect(fieldPropsOnChangeFn).toHaveBeenCalledWith(eventMock);
    expect(propsOnChangeFn).toHaveBeenCalledWith(eventMock);
    expect(fieldOnChangeFn).toHaveBeenCalledWith(eventMock);
    expect(saveFieldFn).not.toHaveBeenCalled();

    onBlur();
    expect(fieldOnBlurFn).toHaveBeenCalled();
    expect(saveFieldFn).toHaveBeenCalled();
  });

  it('should render hook and invoke function correctly when autosave is on', async () => {
    const saveFieldFn = vi.fn();
    vi.spyOn(saveField, 'useSaveField').mockReturnValue(saveFieldFn);

    const { result } = renderHook(() => useFieldEvents({}), {
      wrapper: withFormWrapper({ defaultValues: {} }),
    });
    expect(result.current).toEqual([expect.any(Function), expect.any(Function)]);
    const [handleChange, handleBlur] = result.current;

    const onChange = handleChange({ field, saveOnChange: true });
    const onBlur = handleBlur({ field, saveOnChange: true });

    expect(onChange).toEqual(expect.any(Function));
    expect(onBlur).toEqual(expect.any(Function));

    onChange({ label, value });
    expect(fieldOnChangeFn).toHaveBeenCalledWith(value);
    expect(saveFieldFn).toHaveBeenLastCalledWith({ name, value });

    onChange(eventMock);
    expect(fieldOnChangeFn).toHaveBeenCalledWith(eventMock);
    expect(saveFieldFn).toHaveBeenLastCalledWith({ name, value });

    onBlur();
    expect(fieldOnBlurFn).toHaveBeenCalled();
    expect(saveFieldFn).toHaveBeenCalledTimes(2);
  });
});
