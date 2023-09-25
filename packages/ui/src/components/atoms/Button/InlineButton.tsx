import React from 'react';
import { Button as DaisyButton } from 'react-daisyui';
import classnames from 'classnames';
import { InlineButtonProps } from '../../../types/input-types';

/**
 *
 * NOTE: Icons must have the property "fill" set to "currentColor" so that the component
 * can apply the color scheme to the icon.
 *
 */

export const InlineButton = function InlineButton({ children, className, color, disabled, ...props }: InlineButtonProps) {
  const isRemove = color === 'remove';
  const height = color === 'light' || isRemove ? 'h-10.5' : 'h-9';
  const isSquare = !Boolean(children);

  return (
    <DaisyButton
      {...props}
      className={classnames(
        `
        no-animation 
        min-h-0 
        rounded
        font-light 
        normal-case
        ${height}
        ${className ? className : ''}
        `,
        {
          'btn-ghost': color === 'light',
          'btn-remove w-12': isRemove,
          'btn-primary-inline-light': color === 'secondary',
          'btn-primary-light': color === 'secondary-light',
          'btn-square w-9': isSquare && !isRemove,
          'btn-disabled': disabled,
          'px-3': !isSquare,
        }
      )}
    >
      {children}
    </DaisyButton>
  );
};

export default InlineButton;
