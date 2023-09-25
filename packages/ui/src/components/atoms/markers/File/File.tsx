import React from 'react';
import classnames from 'classnames';

import Large from '../../../../assets/icons/30x30/file.svg';
import Small from '../../../../assets/icons/18x18/file.svg';

export type FileProps = {
  isSmall?: boolean;
};

export function File({ isSmall = false }: FileProps) {
  const Icon = isSmall ? Small : Large;
  return (
    <span
      className={classnames('bg-pale-light flex items-center justify-center rounded-md', {
        'min-w-7.5 max-w-7.5 h-7.5': isSmall,
        'min-w-10.5 max-w-10.5 h-10.5': !isSmall,
      })}
    >
      <Icon className="fill-light" />
    </span>
  );
}

export function SmallFile() {
  return <File isSmall />;
}
