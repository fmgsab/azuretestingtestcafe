import React from 'react';
import { Button as DaisyButton } from 'react-daisyui';
import UserIcon from '../../../assets/icons/24x24/user.svg';
import classnames from 'classnames';
import { LoginButtonProps } from '../../../types/input-types';
/**
 *
 * NOTE: Icons must have the property "fill" set to "currentColor" so that the component
 * can apply the color scheme to the icon.
 *
 */

export const LoginButton = function LoginButton({ className, disabled, imageUrl, ...props }: LoginButtonProps) {
  return (
    <DaisyButton
      {...props}
      className={classnames(
        `
        no-animation 
        btn-primary-inline-light 
        btn-square 
        h-12 
        min-h-0
        rounded
        font-light
        normal-case
        ${className ? className : ''}
        `,
        {
          'btn-disabled': disabled,
        }
      )}
    >
      <div
        className={classnames(`flex h-9 w-9 items-center justify-center rounded-full bg-transparent`, {
          'border-disabled-content border border-opacity-100': disabled,
          'border border-white border-opacity-50': !disabled,
          'border-none': !imageUrl && !disabled,
        })}
      >
        {disabled ? null : imageUrl ? (
          <img src={imageUrl} height="36" width="36" className={`rounded-full`} alt="User Avatar image" />
        ) : (
          <UserIcon aria-label="svg-icon" />
        )}
      </div>
    </DaisyButton>
  );
};

export default LoginButton;
