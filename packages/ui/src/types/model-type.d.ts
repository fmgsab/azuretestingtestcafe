import { ZodObject } from 'zod';
import { TypeOf } from 'zod/lib/types';
import Dexie, { IndexableType, Table } from 'dexie';
import { DefaultValues } from 'react-hook-form/dist/types/form';

export interface IModel<TTable> {
  schema: ZodObject;
  db?: Dexie;
  table?: Table<TypeOf<TTable>>;
  defaultValues?: DefaultValues;
}

export type RowKeyType = IndexableType;
