import React from 'react';
import { Button as DaisyButton } from 'react-daisyui';
import classnames from 'classnames';
import { RoundButtonProps } from '../../../types/input-types';

/**
 *
 * NOTE: Icons must have the property "fill" set to "currentColor" so that the component
 * can apply the color scheme to the icon.
 *
 */

export const RoundButton = function RoundButton({ className, disabled, ...props }: RoundButtonProps) {
  return (
    <DaisyButton
      {...props}
      className={classnames(
        `
        no-animation 
        normal-case 
        font-light 
        min-h-0 
        btn-primary-light
        btn-circle
        `,
        {
          'btn-disabled': disabled,
          [`${className}`]: className
        }
      )}
    />
  );
};

export default RoundButton;
