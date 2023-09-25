import React, { MouseEvent } from 'react';
import classnames from 'classnames';
import Button from '../../atoms/Button/Button';

export type PageSizerProps = {
  size: number;
  label?: string;
  totalSize: number;
  onClick: (arg: MouseEvent | unknown | string | number) => void;
  className?: string;
  isLoading?: boolean;
};

const DEFAULT_LABEL = 'Load More';

export function PageSize({ size, totalSize, onClick, className, label = DEFAULT_LABEL, isLoading }: PageSizerProps) {
  return (
    <div className={classnames('flex flex-col items-center gap-3', { 'cursor-not-allowed': isLoading }, className)}>
      <Button color="secondary" block onClick={onClick} disabled={isLoading || size >= totalSize} aria-label={label || DEFAULT_LABEL}>
        {label || DEFAULT_LABEL}
      </Button>
      <span className={classnames('text-fmg-gray-570 text-sm')}>
        {isLoading ? (
          <></>
        ) : (
          <>
            Viewing {size} of {Math.max(size, totalSize)}
          </>
        )}
      </span>
    </div>
  );
}
