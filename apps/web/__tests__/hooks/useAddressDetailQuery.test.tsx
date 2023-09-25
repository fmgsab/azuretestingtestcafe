import { z, ZodTypeAny } from 'zod';
import { MockedFunction } from 'vitest';
import { renderHook } from '../../test/test-utils';
import { useAddressDetailQuery } from '../../src/hooks/useAddressDetailQuery';

vi.mock('../../src/hooks/useDeferredQuery'); // Mock the useDeferredQuery function
import * as mock from '../../src/hooks/useDeferredQuery';

describe('useAddressDetailQuery', () => {
  test('should call useDeferredQuery with the correct router', () => {
    //const mockDetailRouter = trpc.fmgservices.address.Detail;
    const mockUseDeferredQuery = vi.fn();

    (mock.useDeferredQuery as MockedFunction<z.infer<ZodTypeAny>>).mockReturnValue(mockUseDeferredQuery);

    // Render the hook
    const { result } = renderHook(() => useAddressDetailQuery());

    expect(result.current).toEqual(mockUseDeferredQuery);
  });
});
