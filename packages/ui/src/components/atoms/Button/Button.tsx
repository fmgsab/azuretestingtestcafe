import React from 'react';
import { Button as DaisyButton } from 'react-daisyui';
import classnames from 'classnames';
import { BlockButtonProps } from '../../../types/input-types';

export const Button = function CustomButton({ block = false, children, className, color, disabled, error, ...props }: BlockButtonProps) {
  const colorProp: { color?: 'error' | 'primary' | 'secondary' } = {};
  if (Boolean(error)) {
    colorProp['color'] = 'error';
  } else if (color === 'primary') {
    colorProp['color'] = 'primary';
  } else if (color === 'secondary') {
    colorProp['color'] = 'secondary';
  }

  return (
    <DaisyButton
      disabled={disabled}
      {...props}
      {...colorProp}
      className={classnames(`no-animation btn-sm h-10.5 rounded-md px-6 py-3 font-medium normal-case`, {
        [`${className}`]: className,
        'btn-disabled': disabled,
        'btn-block px-3': block,
        'btn-primary-block-light': color === 'primary-block-light',
        'font-normal': color === 'secondary' || color === 'primary-block-light',
      })}
    >
      {children}
    </DaisyButton>
  );
};

export default Button;
