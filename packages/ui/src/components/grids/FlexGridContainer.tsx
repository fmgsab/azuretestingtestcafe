import React from 'react';
import classnames from 'classnames';
import { gridGap } from '../../../config/constants';

export type FlexGridListProps<T> = {
  data: T[];
  maxCols?: 3 | 4;
  minColWidth: 300 | 370;
  maxContainerWidth?: number;
  containerClasses?: string;
  itemClasses?: string;
  render: (cell: T, idx: number) => React.ReactNode;
};

export function FlexGridContainer<T>({
  data,
  minColWidth = 300,
  maxCols = 4,
  maxContainerWidth,
  containerClasses,
  itemClasses,
  render,
}: FlexGridListProps<T>) {
  // TODO: clean this up
  const maxWidth = maxContainerWidth ?? minColWidth * maxCols + gridGap * (maxCols - 1);

  return (
    // tailwind-safelist  grid-cols-[repeat(auto-fill,minmax(min(100%,300px),1fr))]
    // tailwind-safelist  grid-cols-[repeat(auto-fill,minmax(min(100%,370px),1fr))]
    // tailwind-safelist max-w-[1254px]
    // tailwind-safelist max-w-[1278px]
    <ul
      className={classnames(
        'gap-4.5 grid',
        `grid-cols-[repeat(auto-fill,minmax(min(100%,${minColWidth}px),1fr))]`,
        //`max-w-[${maxWidth}px]`,
        containerClasses
      )}
    >
      {data.map((cell, idx) => {
        return (
          <li key={idx} className={classnames(itemClasses)}>
            {render(cell, idx)}
          </li>
        );
      })}
    </ul>
  );
}
