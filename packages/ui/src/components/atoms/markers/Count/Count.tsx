import React from 'react';
import classnames from 'classnames';

export function Count({ count, displayZero }: { count?: number; displayZero?: boolean }) {
  return (
    <>
      {(count || displayZero) && (
        <div
          className={classnames(
            'bg-blue-220-bg rounded-1.5 h-4.5 ml-3 flex w-6 shrink-0 items-center justify-center text-sm font-medium text-white'
          )}
        >
          {count}
        </div>
      )}
    </>
  );
}
