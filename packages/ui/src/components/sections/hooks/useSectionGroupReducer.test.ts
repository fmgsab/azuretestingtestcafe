import { renderHook, act } from '../../../test/test-utils';

import { useSectionGroupReducer } from './useSectionGroupReducer';

describe('ui/sections/hooks/useSectionGroupReducer', () => {
  it('should return data', async () => {
    const sections = [{ id: 1, name: 'Section 1' }];

    const { result } = renderHook(() => useSectionGroupReducer(sections));

    expect(result.current).toEqual({
      toggle: expect.any(Function),
      activate: expect.any(Function),
      deactivate: expect.any(Function),
      sync: expect.any(Function),
      sections,
    });

    await act(() => result.current.toggle(true));
    expect(result.current.isExpanded).toBe(true);
    await act(() => result.current.toggle(false));
    expect(result.current.isExpanded).toBe(false);
    await act(() => result.current.activate());
    expect(result.current.isActive).toBe(true);
    await act(() => result.current.deactivate());
    expect(result.current.isActive).toBe(false);
    await act(() => result.current.sync());
    expect(result.current.sections).toEqual(sections);
  });
});
