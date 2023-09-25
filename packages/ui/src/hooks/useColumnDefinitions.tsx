import React from 'react';
import classnames from 'classnames';
import { CellContext, CoreRow, createColumnHelper, DeepKeys, DisplayColumnDef } from '@tanstack/react-table';

import { Currency } from '../components/atoms/intl/Currency/Currency';
import { DataCell, DataCellProps } from '../components/tables/DataCell/DataCell';

export type ColumnDefinitionProps<T> = DisplayColumnDef<T> & {
  id: DeepKeys<T>;
  header: string;
  dataType?: 'currency' | 'action';
  value?: string; // use if static: should normally come with 'action' dataType
  isActionDisabled?: boolean;
  path?: string; // when needing a value from a different column
  maxSize?: number;
  size?: number;
  onClick?: DataCellProps['onClick'];
  formatValue?: (value: unknown) => string;
};

export type CellProps<T> = Partial<ColumnDefinitionProps<T>> & {
  getValue: CellContext<T, string>['getValue'];
  getPathValue?: CoreRow<T>['getValue'];
};

export type UseColumnDefinitionsProps<T> = ColumnDefinitionProps<T>[];

export function Header({ content }: Pick<DataCellProps, 'content'>) {
  return <DataCell content={content} />;
}

export function Cell<T>({ path, dataType, isActionDisabled, onClick, value, getValue, getPathValue, formatValue }: CellProps<T>) {
  const columnValue = getValue();
  const key: string = path ? getPathValue?.(path) ?? columnValue : columnValue;
  const renderValue = () => {
    if (value) return value;

    const formattedValue = formatValue?.(columnValue) ?? columnValue;

    return dataType === 'currency' ? <Currency value={formattedValue} /> : formattedValue;
  };

  const isAction = dataType === 'action';
  const className = isAction
    ? classnames({ 'text-link': !isActionDisabled, 'text-link-disabled cursor-not-allowed': isActionDisabled })
    : undefined;

  return (
    <DataCell content={renderValue()} className={className} onClick={isAction && !isActionDisabled ? () => onClick?.(key) : undefined} />
  );
}

export function useColumnDefinitions<T>(definitions: UseColumnDefinitionsProps<T>) {
  const columnHelper = createColumnHelper<T>();

  return definitions.map(
    ({ id, header: headerContent, dataType, value, isActionDisabled, path, maxSize, size, onClick, formatValue, ...others }) => {
      const meta =
        size || maxSize
          ? undefined
          : {
              isAutoSizable: true,
            };
      return columnHelper.accessor(id, {
        meta,
        header: () => <Header content={headerContent} />,
        cell: (info: CellContext<T, unknown>) => (
          <Cell
            id={id}
            getValue={info.getValue}
            getPathValue={info.row.getValue}
            dataType={dataType}
            path={path}
            value={value}
            onClick={onClick}
            isActionDisabled={isActionDisabled}
            formatValue={formatValue}
          />
        ),
        size: size ?? maxSize,
        maxSize,
        ...others,
      } as unknown as DisplayColumnDef<T>);
    }
  );
}
