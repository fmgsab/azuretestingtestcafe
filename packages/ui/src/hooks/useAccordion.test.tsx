import * as reactSpring from '@react-spring/web';
import { act, renderHook } from '../test/test-utils';

import { useAccordion } from './useAccordion';

describe('ui/hooks/useAccordion', () => {
  it.each`
    isDefaultOpen
    ${true}
    ${false}
  `('should render hook correctly when isDefaultOpen=$isDefaultOpen', async ({ isDefaultOpen }) => {
    const onShowFn = vi.fn();
    const useSpringSpy = vi.spyOn(reactSpring, 'useSpring');

    const { result } = renderHook(() => useAccordion({ isDefaultOpen, onShow: onShowFn }));
    let show = result.current.show;

    expect(useSpringSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        maxHeight: expect.any(String),
        config: expect.any(Object),
      })
    );

    expect(result.current).toEqual(
      expect.objectContaining({
        toggle: expect.any(Function),
        show: isDefaultOpen,
        containerProps: expect.objectContaining({
          'aria-hidden': !isDefaultOpen,
          className: expect.any(String),
          id: expect.any(String),
          style: expect.any(Object),
        }),
        triggerProps: expect.objectContaining({
          'aria-controls': isDefaultOpen ? expect.any(String) : undefined,
          'aria-expanded': isDefaultOpen || undefined,
          onClick: expect.any(Function),
          onKeyDown: expect.any(Function),
          tabIndex: expect.any(Number),
        }),
      })
    );

    await act(() => {
      result.current.triggerProps.onClick?.();
    });

    expect(result.current.show).toBe(!show);
    expect(onShowFn).toHaveBeenCalledWith(!show);
    show = result.current.show;

    await act(() => {
      result.current.triggerProps.onKeyDown?.({ code: 'Enter' });
    });

    expect(result.current.show).toBe(!show);
    expect(onShowFn).toHaveBeenCalledWith(!show);

    await act(() => {
      result.current.toggle?.(isDefaultOpen);
    });

    expect(result.current.show).toBe(isDefaultOpen);
    expect(onShowFn).toHaveBeenCalledWith(isDefaultOpen);
  });
});
