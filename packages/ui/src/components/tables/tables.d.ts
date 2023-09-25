import React, { JSXElementConstructor } from 'react';
import { SortingState } from '@tanstack/react-table';
import { UseColumnDefinitionsProps } from '../../hooks';

import IntrinsicAttributes = React.JSX.IntrinsicAttributes;

export interface IRow {
  [key: string]: unknown;
}

export type CardViewer<T extends IRow> = JSXElementConstructor<T & z.infer<IntrinsicAttributes>>;

export type TableProps<T extends IRow> = {
  columnDefinitions: UseColumnDefinitionsProps<T>;
  heading?: string;
  data: T[];
  groupBy?: string;
  globalFilter: unknown;
  setGlobalFilter: React.Dispatch<React.SetStateAction<unknown>>;
  sorting: SortingState;
  setSorting: React.Dispatch<React.SetStateAction<SortingState>>;
};
