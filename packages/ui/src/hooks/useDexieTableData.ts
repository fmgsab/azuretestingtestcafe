import { useLiveQuery } from 'dexie-react-hooks';
import { Table } from 'dexie';
import { RowKeyType } from '../types';

export type UseDexieTableDataProps = {
  tables: Table[];
  keyPath: Record<string, RowKeyType>;
  columnNames?: string[];
};

export type UseDexieTableDataReturn<T> = Record<string, T[]> | undefined;

export function useDexieTableData<T>({ tables, keyPath, columnNames }: UseDexieTableDataProps): UseDexieTableDataReturn<T> {
  return useLiveQuery(async () => {
    const getAllData = () => tables.map((table) => table.where(keyPath).toArray());

    const getColumns = (result: Record<string, unknown>[]) =>
      columnNames?.length ? result.map((row) => columnNames.reduce((acc, col) => ({ ...acc, [col]: row[col] }), {})) : result;

    return Promise.all(getAllData()).then((results) =>
      results.reduce(
        (all, result, idx) => ({
          ...all,
          [tables[idx].name]: getColumns(result),
        }),
        {}
      )
    );
  });
}
