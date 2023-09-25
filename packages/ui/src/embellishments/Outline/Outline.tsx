import React, { JSX, PropsWithChildren } from 'react';
import classnames from 'classnames';

type OutlineProps = PropsWithChildren<{
  as?: keyof JSX.IntrinsicElements;
}>;

export function Outline({ as = 'div', children }: OutlineProps) {
  const Element = as;

  return (
    <Element className={classnames('border-1 border-fmg-gray-200 w-full rounded-md border border-t-0')}>
      <div className={classnames('bg-fmg-green h-0.75 rounded-t-md')} />
      {children}
    </Element>
  );
}
