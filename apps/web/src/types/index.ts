import { TableTypes } from 'models';

export type DbTables = { tables: { name: string; rows: TableTypes[] }[] };
export type DbRow = TableTypes;
