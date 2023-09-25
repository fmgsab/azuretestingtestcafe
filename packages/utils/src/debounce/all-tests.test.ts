import { debounce } from './debounce';

describe('debounce', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  it('should debounce the function and resolve with correct result', async () => {
    const mockFn = vi.fn((args: number) => args * 2);
    const [debouncedFunc, teardown] = debounce(mockFn, 200);

    // Call the debounced function multiple times
    debouncedFunc(1);
    debouncedFunc(2);
    debouncedFunc(3);

    expect(mockFn).not.toHaveBeenCalled();

    // Fast-forward time by 200ms
    vi.advanceTimersByTime(200);

    // Ensure that the function is called only once with the last argument (3 * 2)
    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(mockFn).toHaveBeenCalledWith(3);
    // Call the teardown function to clear the timer
    teardown();
  });

  it('should debounce the function and not call it if debounced time has not passed', async () => {
    const mockFn = vi.fn((args: string) => args.toUpperCase());
    const [debouncedFunc, teardown] = debounce(mockFn, 500);

    // Call the debounced function multiple times
    debouncedFunc('hello');
    debouncedFunc('world');

    expect(mockFn).not.toHaveBeenCalled();

    // Fast-forward time by 400ms (less than the debounce time)
    vi.advanceTimersByTime(400);

    // Ensure that the function is not called yet
    expect(mockFn).not.toHaveBeenCalled();

    // Fast-forward time by another 400ms (total 800ms, more than the debounce time)
    vi.advanceTimersByTime(400);

    // Ensure that the function is called only once with the last argument ('world')
    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(mockFn).toHaveBeenCalledWith('world');
    // Call the teardown function to clear the timer
    teardown();
  });
});
