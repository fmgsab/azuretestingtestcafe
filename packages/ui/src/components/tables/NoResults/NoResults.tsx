import React from 'react';
import classnames from 'classnames';

export type NoResultsProps = {
  Icon: React.FunctionComponent<React.SVGAttributes<SVGElement>>;
  title: string;
  description?: string | string[];
};

/**
 * Icon should be 18x18 to be scaled by 1.25
 * @param Icon
 * @param title
 * @param description
 * @constructor
 */
export function NoResults({ Icon, title, description }: NoResultsProps) {
  const descriptions = [description].filter(Boolean).flat();
  return (
    <div data-testid="no-results" className={classnames('p-10.5 grid place-content-center gap-3 text-center', 'bg-blue-240-bg rounded-md')}>
      <span className={classnames('grid place-content-center')}>
        <span className={classnames('bg-fmg-gray-170 grid h-12 w-12 place-content-center rounded-md')}>
          <Icon className={classnames('fill-fmg-gray-720 scale-125 stroke-2')} />
        </span>
      </span>
      <span className={classnames('text-md mt-3 grid h-6 place-content-center font-medium')}>{title}</span>
      <span className={classnames('grid place-content-center gap-1.5')}>
        {descriptions.map((desc) => (
          <span key={desc} className={classnames('h-4.5')}>
            {desc}
          </span>
        ))}
      </span>
    </div>
  );
}
