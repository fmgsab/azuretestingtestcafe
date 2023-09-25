import React from 'react';
import { CheckboxProps } from '../../../types/input-types';
import CheckboxIcon from '../../../assets/icons/18x18/check-box.svg';
import BoxIcon from '../../../assets/icons/18x18/box.svg';
import classnames from 'classnames';

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(function CustomInput(
  {defaultChecked, disabled, error, label, name, value, ...props},
  ref
) {
  const rounded = 'transition duration-300 ease-in rounded-full';
  const isError = Boolean(error);

  return (
    <div className={classnames(`h-10.5 inline-flex items-center p-3 focus-visible:outline-0`)}>
      <label
        className={classnames(
          `group relative inline-flex cursor-pointer select-none items-center justify-center gap-1.5 focus-visible:outline-0 `,
          {
            '!cursor-not-allowed': disabled,
          }
        )}
        data-testid={`checkbox-label-wrapper-${name}`}
        aria-invalid={isError}
      >
        <input
          id={`checkbox-${name}-${value}`}
          data-testid={`checkbox-${name}-${value}`}
          value={value}
          type="checkbox"
          name={name}
          ref={ref}
          disabled={disabled}
          className={classnames(`w-4.5 h-4.5 peer opacity-0 focus-visible:ring-0`)}
          defaultChecked={defaultChecked}
          {...props}
        />
        <BoxIcon
          className={classnames('text-gray-25 absolute left-0 peer-checked:invisible', {
            'bg-gray-5': disabled,
          })}
        />
        <CheckboxIcon
          className={classnames('invisible absolute left-0 peer-checked:visible', {
            'text-fmg-green': !isError,
            'opacity-50': disabled,
            'text-error': isError,
          })}
        />
        <span
          className={classnames(
            `w-7.5 h-7.5 group-hover:bg-fmg-green-20 group-focus-visible:bg-fmg-green-20 peer-focus-visible:bg-fmg-green-20 absolute -left-1.5 -z-50 ${rounded}`,
            {
              'group-hover:bg-transparent group-focus-visible:bg-transparent': disabled,
              'group-focus-visible:bg-transparent group-hover:peer-checked:bg-transparent ': isError,
            }
          )}
        ></span>
        <span className="text-text-primary peer-disabled:opacity-50 " data-testid={`checkbox-label-${name}`}>
          {label}
        </span>
      </label>
    </div>
  );
});

Checkbox.displayName = 'Checkbox';
