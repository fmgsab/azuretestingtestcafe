import { Dispatch, SetStateAction, useId, useRef, useState } from 'react';
import { SpringValue, useSpring } from '@react-spring/web';
import classnames from 'classnames';

export type UseAccordionProps = {
  isDefaultOpen?: boolean;
  remThreshold?: number;
  onShow?: (show: boolean) => void;
  duration?: number;
};

export type UseAccordionReturn = {
  toggle?: Dispatch<SetStateAction<boolean>>;
  show?: boolean;
  triggerProps: {
    'aria-controls'?: string;
    'aria-expanded'?: boolean;
    tabIndex?: number;
    onClick?: () => void;
    onKeyDown?: ({ code }: { code: string }) => void;
  };
  containerProps: {
    id?: string;
    'aria-hidden'?: boolean;
    className?: string;
    style?: Record<string, SpringValue>;
  };
};

export function useAccordion({ isDefaultOpen = false, onShow, duration }: UseAccordionProps = {}): UseAccordionReturn {
  const id = useId();
  const idRef = useRef(`accordion-${id}`);
  const [show, setShow] = useState(isDefaultOpen);

  const props = useSpring({
    maxHeight: show ? '999rem' : '0rem',
    config: { mass: 1, tension: 170, friction: 24, duration },
  });

  return {
    toggle: setShow,
    show,
    triggerProps: {
      'aria-controls': show ? idRef.current : undefined,
      'aria-expanded': show || undefined,
      tabIndex: 0,
      onClick: () => {
        setShow(!show);
        onShow?.(!show);
      },
      onKeyDown: ({ code }: { code: string }) => {
        if (code === 'Enter') {
          setShow(!show);
          onShow?.(!show);
        }
      },
    },
    containerProps: {
      id: idRef.current,
      'aria-hidden': !show,
      className: classnames('overflow-hidden relative'),
      style: {
        ...props,
      },
    },
  };
}
