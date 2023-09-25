import React, { useId } from 'react';
import { InputProps } from '../../../types';
import classnames from 'classnames';

export type RadioProps = InputProps & { checked?: boolean; defaultChecked?: boolean };

export const Radio = React.forwardRef<HTMLInputElement, RadioProps>(function CustomInput(
  { error, defaultChecked, className, disabled, label, value, ...props },
  ref
) {
  const CENTER_ROUND = 'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full';
  const isError = Boolean(error);

  const componentId = useId();

  return (
    <label
      className={classnames('min-h-10.5 group flex items-center px-3', { 'opacity-50': disabled }, className)}
      aria-invalid={isError}
      {...props}
    >
      <div
        id={`check-container-${componentId}`}
        className={classnames(`w-7.5 h-7.5 relative -ml-1.5 flex cursor-pointer `, {
          '!cursor-not-allowed': disabled,
        })}
      >
        <input
          value={value}
          type="radio"
          name={props.name}
          ref={ref}
          disabled={disabled}
          className={classnames(`peer opacity-0`, {})}
          defaultChecked={defaultChecked}
        />
        <div
          id={`checkfocus-${componentId}`}
          className={classnames(
            `${CENTER_ROUND} w-7.5 h-7.5 min-w-full transition duration-300 ease-in`,
            'peer-focus-visible:bg-fmg-green-20',
            '[&:not(.peer-focus-visible)]:group-hover:bg-fmg-green-20',
            {
              'transition-none group-hover:!bg-transparent': disabled,
              // TODO: Check if realistic scenario
              // 'group-hover:bg-error-20': !disabled && isError,
            }
          )}
        />
        <div
          id={`checkmark-${componentId}`}
          className={classnames(
            `${CENTER_ROUND} w-4.5 h-4.5 border-1 border-gray-25 border transition duration-100`,
            'peer-checked:border-0',
            {
              'peer-checked:bg-fmg-green': !isError,
              'peer-checked:bg-error': isError,
              'bg-gray-10': disabled,
            }
          )}
        />
        <div
          id={`checkcenter-${componentId}`}
          className={classnames(`${CENTER_ROUND} delay-50 h-1 w-1 peer-checked:bg-white`, 'peer-checked:border-0 peer-checked:bg-white')}
        />
      </div>
      <span className="max-h-full">{label}</span>
    </label>
  );
});

export default Radio;
