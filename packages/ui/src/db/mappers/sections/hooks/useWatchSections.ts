import { useLiveQuery } from 'dexie-react-hooks';
import { Table } from 'dexie';

import { SectionTableProps, SectionTableType } from '../../../section-types';
import store from '../store';

export function useWatchSections<T>({ name, table, uid = {}, displayNamePath }: SectionTableProps & { table?: Table }) {
  const proxyTable = store.useStore(store.selectGroup(name));
  if (!proxyTable && !table) {
    store.createGroup(name);
  }
  const tableObj: SectionTableType = table ?? proxyTable;

  const liveTableData = useLiveQuery(async () => (table ? await table?.where(uid)?.sortBy('created') : null));
  const records: Record<string, unknown>[] = liveTableData ?? proxyTable?.toArray() ?? [];
  const result = records.map((record) => ({
    ...record,
    name: record[displayNamePath ?? 'name'],
  })) as T[];

  return { result, table: tableObj };
}
