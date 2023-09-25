import React from 'react';

import NotStarted from '../../../../assets/icons/18x18/circle.svg';
import Complete from '../../../../assets/icons/18x18/check-circle.svg';
import Incomplete from '../../../../assets/icons/18x18/half-circle.svg';
import InProgress from '../../../../assets/icons/18x18/minus-circle.svg';

export type StatusProps = {
  hasStarted?: boolean;
  hasCompleted?: boolean;
  hasError?: boolean;
  inProgress?: boolean;
};

type MessageProps = {
  message?: string;
};

const config = {
  noProgress: ['black-86', NotStarted],
  inProgress: ['incomplete', InProgress],
  incomplete: ['incomplete', Incomplete],
  inError: ['error', Incomplete],
  complete: ['fmg-green', Complete],
};

type Config = keyof typeof config;

function evaluateStatus({ hasStarted, hasCompleted, hasError, inProgress }: StatusProps): Config {
  if (hasError) return 'inError';
  if (hasCompleted) return 'complete';
  if (inProgress) return 'inProgress';

  return hasStarted ? 'incomplete' : 'noProgress';
}

export function Status({ message, ...props }: StatusProps & MessageProps) {
  // tailwind-safelist fill-black-86 fill-incomplete fill-error fill-fmg-green
  // tailwind-safelist text-black-86 text-incomplete text-error text-fmg-green
  const [color, Component] = config[evaluateStatus(props)];
  return (
    <span className={`flex gap-1.5 text-${color}`}>
      <Component className={`fill-${color}`} />
      {message}
    </span>
  );
}
