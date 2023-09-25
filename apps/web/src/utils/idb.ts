import { db } from 'models';
import { DbRow, DbTables } from '../types';

const deSerialize = (row: DbRow) =>
  Object.keys(row).reduce((acc, curr) => {
    try {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      acc[curr] = JSON.parse(row[curr]);
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      acc[curr] = row[curr];
    }

    return acc;
  }, {} as Record<string, DbRow>);

export const importAzureTablesToIdb = async (data: DbTables) => {
  data.tables.forEach((table) => {
    table.rows.map(async (row) => {
      const rowData = deSerialize(row);

      await db
        .table(table.name)
        .add({ ...rowData })
        .catch(() => {
          db.table(table.name).update(row.id, { ...rowData });
        });
    });
  });
};
