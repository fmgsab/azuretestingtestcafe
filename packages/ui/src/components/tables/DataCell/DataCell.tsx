import React, { MouseEvent } from 'react';
import classnames from 'classnames';

export type DataCellProps = {
  content: string | React.ReactElement;
  className?: string;
  keepContent?: boolean;
  onClick?: (arg: MouseEvent | unknown | string) => void;
};

export function DataCell({ content, className, keepContent = false, onClick }: DataCellProps) {
  const role = onClick ? 'button' : undefined;
  const truncate = [{ truncate: !keepContent }, { 'break-normal': keepContent }];
  return (
    <div role={role} onClick={onClick} className={classnames('flex h-full items-center gap-3', ...truncate, className)}>
      <span className={classnames(...truncate, 'inline-block')}>{content}</span>
    </div>
  );
}
