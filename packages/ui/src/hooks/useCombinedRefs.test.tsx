import React, { forwardRef, useRef } from 'react';
import { act, render, renderHook } from '../test/test-utils';
import { isMutableRefObject, useCombinedRefs } from './useCombinedRefs';

const MyComponent = forwardRef<HTMLDivElement, { text: string }>(function CustomComp(props, ref) {
  return <div ref={ref}>{props.text}</div>;
});

describe('useCombinedRefs', () => {
  it('should return true if MutableRefObject', async () => {
    const { result } = renderHook(() => useRef<HTMLDivElement>({} as HTMLDivElement));
    expect(isMutableRefObject(result.current)).toBeTruthy();
  });

  it('should return a single ref that holds all the passed refs', () => {
    const { result } = renderHook(() => {
      const ref1 = useRef<HTMLDivElement>();
      const ref2 = useRef<HTMLDivElement>();
      return useCombinedRefs<HTMLDivElement>([ref1, ref2]);
    });

    const [combinedRef, setRef] = result.current;

    expect(combinedRef.current).toBeUndefined();

    const node = {};
    act(() => {
      setRef(node as HTMLDivElement);
    });

    expect(combinedRef.current).toBe(node);
  });

  it('should work for forwarded ref', () => {
    const forwardedRef = React.createRef<HTMLDivElement>();
    const { container } = render(<MyComponent ref={forwardedRef} text="hello" />);
    expect(forwardedRef.current).toBe(container.firstChild);

    const { result } = renderHook(() => {
      const ref1 = useRef<HTMLDivElement>();
      return useCombinedRefs<HTMLDivElement>([ref1, forwardedRef]);
    });

    const [combinedRef, setRef] = result.current;

    const node = {};
    act(() => {
      setRef(node as HTMLDivElement);
    });

    expect(combinedRef.current).toEqual(forwardedRef.current);
    expect(combinedRef.current).toBe(node);
  });
});
