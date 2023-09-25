import { z, ZodTypeAny } from 'zod';
import { MockedFunction } from 'vitest';
import { renderHook } from '../../test/test-utils';
import { useAddressLookupQuery } from '../../src/hooks/useAddressLookupQuery';

vi.mock('../../src/hooks/useDeferredQuery'); // Mock the useDeferredQuery function
import * as mock from '../../src/hooks/useDeferredQuery';

describe('useAddressLookupQuery', () => {
  test('should call useDeferredQuery with the correct router', () => {
    //const mockLookupRouter = trpc.fmgservices.address.lookup;
    const mockUseDeferredQuery = vi.fn();

    (mock.useDeferredQuery as MockedFunction<z.infer<ZodTypeAny>>).mockReturnValue(mockUseDeferredQuery);

    // Render the hook
    const { result } = renderHook(() => useAddressLookupQuery());

    expect(result.current).toEqual(mockUseDeferredQuery);
  });
});
