import { renderHook, act } from '../../test/test-utils';
import { useDeferredQuery } from '../../src/hooks/useDeferredQuery';

describe('useDeferredQuery', () => {
  it('should fetch data with the correct parameters', async () => {
    const mockUseQuery = vi.fn().mockReturnValue({
      refetch: async () => {
        await new Promise((resolve) => setTimeout(resolve, 100)); // Simulate an async operation
      },
    });

    const mockRouter = {
      useQuery: mockUseQuery,
    };

    const { result } = renderHook(() => useDeferredQuery({ router: mockRouter }));

    // Fetch data with new parameters
    await act(async () => {
      const [fetchData] = result.current;
      await fetchData('newParams');
    });

    // Assert the expected behavior
    expect(mockUseQuery).toHaveBeenCalledWith('newParams', { enabled: false, retry: expect.any(Number), retryDelay: expect.any(Number) });
  });

  it('should update isRefetching state correctly', async () => {
    const mockRouter = {
      useQuery: vi.fn(() => ({
        refetch: async () => {
          await new Promise((resolve) => setTimeout(resolve, 100));
        },
        isRefetching: true,
      })),
    };

    const { result } = renderHook(() => useDeferredQuery({ router: mockRouter }));

    // Fetch data with new parameters
    await act(async () => {
      const [fetchData] = result.current;
      await fetchData('newParams');
      expect(result.current[1]).toBe(true);
    });
  });
});
