import React, { useLayoutEffect, useRef } from 'react';
import classnames from 'classnames';
import { useCombinedRefs } from '../../../hooks/useCombinedRefs';
import { InputProps } from '../../../types/input-types';

export type TextareaProps = {
  autosize?: boolean;
  rows?: number;
  required?: boolean;
} & Omit<InputProps, 'options'>;

export const useAutosizeTextArea = () => {
  const ref = useRef<HTMLTextAreaElement>();
  const minHeight = 60;

  useLayoutEffect(() => {
    let currElement: HTMLTextAreaElement;

    if (ref.current) {
      currElement = ref.current;

      const resize = (): void => {
        currElement.style.height = 'auto';
        const scrollHeight = Math.max(currElement.scrollHeight, minHeight);
        currElement.style.height = `${scrollHeight}px`;
      };

      resize();

      currElement?.addEventListener('input', resize);
      return () => currElement?.removeEventListener('input', resize);
    }
  }, []);

  return { ref };
};

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(function CustomInput(
  { autosize = true, error, className, disabled, label, size = 4, ...props },
  ref
) {
  const width = `w-grid-${size}`;
  const { ref: autosizeRef } = useAutosizeTextArea();

  const [, setRef] = useCombinedRefs([ref, autosize ? autosizeRef : null]);

  const baseStyle = classnames(
    `${width} transition ease-in duration-150 flex text-base rounded outline bg-field-bg hover:bg-field-hover p-3`,
    {
      'overflow-hidden': autosize,
      'outline-1 outline-gray-10 bg-transparent hover:bg-transparent': disabled,
      'outline-0 outline-fmg-green active:outline-1 focus-within:outline-1': !disabled && !error,
      'outline-1 outline-error': error,
      className,
    }
  );

  return (
    <textarea
      className={baseStyle}
      aria-invalid={Boolean(error)}
      aria-label={props['aria-label'] ?? label ?? props.name}
      ref={setRef}
      disabled={disabled}
      {...props}
    />
  );
});

export default Textarea;
