import React from 'react';
import classnames from 'classnames';

import { File } from '../../atoms/markers/File/File';
import { Timestamp } from '../../atoms/intl/Timestamp/Timestamp';
import { Status } from '../../atoms/markers/Status/Status';

export type WorkItemProps = {
  name: string;
  description: string;
  timestamp: string;
  completeState: [boolean, string];
  onClick: (event: React.MouseEvent) => void;
};

export function WorkItem({ name, description, timestamp, completeState, onClick }: WorkItemProps) {
  return (
    <div
      tabIndex={0}
      className={classnames(
        'group grid',
        'border-fmg-gray-200 rounded-md border',
        'hover:border-fmg-green focus-visible:border-fmg-green focus-within:border-fmg-green focus-visible:outline-0'
      )}
      id={`work-item-${name}`}
      onClick={onClick}
      role="button"
    >
      <span className={classnames('p-4.5 gap-4.5 grid', 'hover:border-fmg-green focus-visible:outline-0')}>
        <File />
        <span className={classnames('grid auto-rows-[18px_18px] gap-1.5')}>
          <span className={classnames('text-md truncate font-medium leading-4')}>{name}</span>
          <span className={classnames('text-fmg-gray-710 truncate')}>{description}</span>
          <Timestamp date={timestamp} action="last opened" className="text-fmg-gray-510" />
        </span>
      </span>
      <span
        className={classnames(
          'p-4.5 h-18 grid items-center',
          'border-t-fmg-gray-200 overflow:hidden rounded-b-md border border-transparent',
          'group-hover:bg-fmg-gray-50 group-focus-visible:bg-fmg-gray-50 group-focus:bg-fmg-gray-50'
        )}
      >
        <Status hasCompleted={completeState[0]} inProgress={!completeState[0]} message={completeState[1]} />
      </span>
    </div>
  );
}

function Loading() {
  return (
    <div data-testid="card-loading-skeleton" className={classnames('bg-fmg-gray-60 grid rounded-md')}>
      <span className={classnames('p-4.5 gap-4.5 grid')}>
        <span className={classnames('w-10.5 h-10.5 bg-loading-dark rounded-md')} />
        <span className={classnames('grid auto-rows-[18px_18px] gap-1.5')}>
          <span className={classnames('h-4.5 bg-loading w-[132px] rounded-md')} />
          <span className={classnames('h-4.5 bg-loading w-[264px] rounded-md')} />
          <span className={classnames('h-4.5 bg-loading w-[264px] rounded-md')} />
        </span>
      </span>
      <span className={classnames('p-4.5 h-18 grid items-center', 'overflow:hidden bg-loading rounded-b-md')}>
        <span className={classnames('h-4.5 bg-loading-dark w-[132px] rounded-md')} />
      </span>
    </div>
  );
}

WorkItem.Loading = Loading;
