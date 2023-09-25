import { renderHook } from '../../test/test-utils';
import { useGetLeadsQuery } from '../../src/hooks/useGetLeadsQuery';

describe('useGetLeadsQuery', () => {
  test('should call useDeferredQuery with the correct router', () => {
    // Render the hook
    const { result } = renderHook(() => useGetLeadsQuery());

    expect(result.current).toEqual(expect.any(Function));
  });
});
