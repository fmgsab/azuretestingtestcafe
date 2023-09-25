import { renderHook, act } from '../../../test/test-utils';

import { useConfirmationReducer } from './useConfirmationReducer';

describe('ui/sections/hooks/useConfirmationReducer', () => {
  it('should return data', async () => {
    const { result } = renderHook(useConfirmationReducer);

    expect(result.current).toEqual({
      openConfirmation: expect.any(Function),
      toggleConfirmation: expect.any(Function),
      closeConfirmation: expect.any(Function),
      onConfirm: expect.any(Function),
      shouldConfirm: expect.any(Boolean),
    });

    await act(() => result.current.onConfirm());
    const callback = vi.fn();

    await act(() => result.current.openConfirmation(callback));
    expect(result.current.shouldConfirm).toBe(true);
    expect(result.current.onConfirm).toEqual(callback);
    await act(() => result.current.toggleConfirmation());
    expect(result.current.shouldConfirm).toBe(false);
    await act(() => result.current.closeConfirmation());
    expect(result.current.shouldConfirm).toBe(false);
  });
});
