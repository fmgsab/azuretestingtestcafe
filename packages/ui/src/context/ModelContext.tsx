import { createContext, useContext } from 'react';
import { ZodObject, ZodRawShape } from 'zod';
import { IModel, RowKeyType } from '../types/model-type';

export type ModelContextProps = IModel<string> & { uid: RowKeyType };

export const ModelContext = createContext<ModelContextProps>({
  uid: 0,
  schema: {} as ZodObject<ZodRawShape>,
});
export const useModelContext = () => useContext(ModelContext);
