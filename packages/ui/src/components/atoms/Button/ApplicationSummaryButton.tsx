import React from 'react';
import classnames from 'classnames';
import { ApplicationSummaryButtonProps } from '../../../types/input-types';
import HomeIcon from '../../../assets/icons/18x18/house.svg';

const ApplicationSummaryButton = ({ children, className, isActive = false, ...props }: ApplicationSummaryButtonProps) => {
  return (
    <button
      {...props}
      aria-label="Application Summary button"
      type='button'
      className={classnames(`relative no-animation flex items-center h-10.5 rounded-md font-medium normal-case border border-multi-value pr-4.5 w-full hover:bg-blue-240-hover active:bg-blue-240-pressed`, {
        'bg-blue-240-active': isActive,
        [`${className}`]: className,
      })}
    >
      {/*This is the little left end "active" marker/indicator*/}
      <span
        className={classnames('w-0.75 bg-blue-216-active absolute h-3 rounded-r-sm', {
          'opacity-0': !isActive,
        })}
      />
      <span className="mx-3 text-blue-216-active">
        <HomeIcon />
      </span>
      {children}
    </button>
  );
}

export default ApplicationSummaryButton;
