import { renderHook, act } from '../test/test-utils';
import { useDebouncedValue } from './useDebouncedValue';

describe('useDebouncedValue', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.clearAllTimers();
  });

  it('should return the initial value immediately', () => {
    const initialValue = 'Hello';
    const { result } = renderHook(() => useDebouncedValue(initialValue));

    expect(result.current).toBe(initialValue);
  });

  it('should update the debounced value after the specified delay', () => {
    const initialValue = 'Hello';
    const updatedValue = 'Hello, World!';
    const delay = 1000;
    const { result, rerender } = renderHook((props) => useDebouncedValue(() => props.value, props.delay), {
      initialProps: { value: initialValue, delay },
    });

    expect(result.current).toBe(initialValue);

    act(() => {
      rerender({ value: updatedValue, delay });
    });

    // Check that the debounced value hasn't changed immediately
    expect(result.current).toBe(initialValue);

    // Fast-forward time by the specified delay
    act(() => {
      vi.advanceTimersByTime(delay);
    });

    // Check that the debounced value has been updated
    expect(result.current).toBe(updatedValue);
  });

  it('should use a default delay of 500ms if no delay is specified', () => {
    const initialValue = 'Hello';
    const updatedValue = 'Hello, World!';
    const { result, rerender } = renderHook(({ value }) => useDebouncedValue(() => value), {
      initialProps: { value: initialValue },
    });

    expect(result.current).toBe(initialValue);

    act(() => {
      rerender({ value: updatedValue });
    });

    // Check that the debounced value hasn't changed immediately
    expect(result.current).toBe(initialValue);

    // Fast-forward time by the default delay (500ms)
    act(() => {
      vi.advanceTimersByTime(500);
    });

    // Check that the debounced value has been updated
    expect(result.current).toBe(updatedValue);
  });

  it('should clear the timer when unmounting the component', () => {
    const initialValue = 'Hello';
    const { result, unmount } = renderHook(() => useDebouncedValue(() => initialValue, 1000));

    expect(result.current).toBe(initialValue);

    act(() => {
      unmount();
    });

    // Fast-forward time by the specified delay
    act(() => {
      vi.advanceTimersByTime(1000);
    });

    // Check that the debounced value hasn't changed after unmounting
    expect(result.current).toBe(initialValue);
  });
});
