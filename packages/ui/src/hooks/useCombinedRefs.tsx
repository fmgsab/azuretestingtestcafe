import { ForwardedRef, MutableRefObject, useCallback, useRef } from 'react';

export type CombinedRefType<T extends Element> = Array<ForwardedRef<T> | MutableRefObject<T | undefined>>;

export function isMutableRefObject<T>(ref: ForwardedRef<T> | MutableRefObject<T | undefined>): ref is MutableRefObject<T> {
  return ref != null && 'current' in ref;
}

export function useCombinedRefs<T extends Element>(refs: CombinedRefType<T>): [MutableRefObject<T>, (node: T) => void] {
  const combinedRef = useRef<T>();

  const setRef = useCallback(
    (node: T) => {
      refs?.forEach((ref) => {
        if (ref && isMutableRefObject(ref)) {
          ref.current = node;
        }
      });
      combinedRef.current = node;
    },
    [refs]
  );

  return [combinedRef as MutableRefObject<T>, setRef];
}
