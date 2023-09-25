import React, { Children } from 'react';
import { animated } from '@react-spring/web';

import { useAccordion, UseAccordionProps, UseAccordionReturn } from '../../hooks/useAccordion';

export type AccordionProps = Pick<UseAccordionProps, 'isDefaultOpen' | 'onShow'> & {
  children: React.ReactElement | React.ReactElement[];
};

export type AccordionChildProps = Pick<UseAccordionReturn, 'show' | 'toggle'>;
export type AccordionReturnProps = Partial<UseAccordionReturn> & {
  render: (props: AccordionChildProps) => React.ReactNode;
};
export type AccordionHeadingProps = AccordionReturnProps & { className?: string };

export function Accordion({ isDefaultOpen, onShow, children }: AccordionProps) {
  const props = useAccordion({ isDefaultOpen, onShow });

  return (
    <>
      {Children.map(children, (child) => {
        return React.cloneElement(child, props);
      })}
    </>
  );
}

function AccordionHeading({ show, toggle, className, render, ...props }: AccordionHeadingProps) {
  return (
    <animated.div {...props.triggerProps} className={className}>
      {render({ show, toggle })}
    </animated.div>
  );
}

function AccordionContent({ show, toggle, render, ...props }: AccordionReturnProps) {
  return <animated.div {...props.containerProps}>{render({ show, toggle })}</animated.div>;
}

Accordion.Heading = AccordionHeading;
Accordion.Content = AccordionContent;
