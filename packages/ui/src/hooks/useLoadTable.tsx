import { Table } from 'dexie';
import { useLiveQuery } from 'dexie-react-hooks';
import { FieldValues, UseFormProps } from 'react-hook-form';
import { UseFormReturn } from 'react-hook-form/dist/types/form';
import { ZodDiscriminatedUnion, ZodEffects } from 'zod';
import { ZodError, ZodInvalidTypeIssue, ZodIssue } from 'zod/lib/ZodError';
import { TypeOf, ZodType } from 'zod/lib/types';

import { IModel, RowKeyType } from '../types';
import { ModelContextProps } from '../context/ModelContext';

export type Result<T> = Awaited<TypeOf<ZodType>> | T;

export type LoadTableProps<T> = {
  form: Pick<UseFormReturn, 'setValue' | 'formState' | 'getFieldState' | 'clearErrors' | 'getValues'>;
  uid: RowKeyType;
  model: IModel<T>;
  defaultValues: UseFormProps['defaultValues'];
  discriminator?: keyof Result<T>;
};

export type LoadTableReturn<T> = {
  result?: Result<T>;
  count?: number;
  isLoaded?: boolean;
};

export function safeResolve(type: ZodType, value: object | string | number | boolean) {
  const result = type?.safeParse(value);

  if (!result || result?.success) return value;

  const { error: { issues = [] } = {} } = result;
  const hasArrayParseError = issues.find((issue) => (issue as ZodInvalidTypeIssue)?.expected === 'array');
  return hasArrayParseError ? Object.values(value) : value;
}

export type SaveValuesProps<T extends FieldValues> = {
  result?: LoadTableReturn<T>['result'];
  table?: Table;
  defaultValues: LoadTableProps<T>['defaultValues'];
} & Pick<ModelContextProps, 'uid'>;

export function saveDefaultValues<T extends FieldValues>({ result = {}, table, uid, defaultValues }: SaveValuesProps<T>) {
  const fieldNames = Object.keys(defaultValues ?? {});

  if (!fieldNames.length) return;
  if (fieldNames.every((nm) => Object.keys(result).includes(nm))) return;

  const getColumns = async (row: Record<string, unknown>) => {
    return fieldNames.map((name) => row[name]).filter(Boolean);
  };

  getColumns(result).then(() => {
    table?.update(uid, defaultValues as Record<string, unknown>).then(function (updated: number) {
      if (updated) {
        // eslint-disable-next-line no-console
        console.log(`default data updated ${defaultValues} ${uid}`);
      }
    });
  });
}

export function extractShape(schema: ZodType, result: Result<unknown>, discriminator: keyof Result<unknown> = 'itemSubtype') {
  const outcome = schema instanceof ZodEffects ? schema.innerType() : schema;
  return outcome instanceof ZodDiscriminatedUnion ? outcome.optionsMap.get(result[discriminator]) : outcome.shape;
}

export async function initFormValues<T>({
  form,
  uid,
  model,
  defaultValues,
  discriminator,
}: LoadTableProps<T>): Promise<LoadTableReturn<T>> {
  const { table, schema } = model;
  const count = await table?.count();
  const result: Result<T> = await table?.get(uid);

  saveDefaultValues({ result, table, uid, defaultValues });

  if (count && result && (!discriminator || result[discriminator])) {
    Object.entries<object>(result).forEach(([key, val]) => {
      const shape = extractShape(schema, result, discriminator);

      const resolved = safeResolve(shape[key], val);
      const { hasError } = result as T & { hasError?: boolean };
      form.setValue(key, resolved, { shouldDirty: hasError, shouldValidate: true, shouldTouch: hasError });
      const { invalid, error, isTouched } = form.getFieldState(key);
      // console.log({ key, error, isTouched, isDirty }, form.formState.isDirty);
      if ((!error?.type || !isTouched) && invalid && !Array.isArray(error)) {
        form.clearErrors(key);
      }
    });

    if (form.formState.isDirty) {
      const { error: { issues } = {} as ZodError } = await schema.safeParseAsync(form.getValues());
      const validIssues = issues?.filter((issue: ZodIssue) => issue.message !== 'undefined');

      const hasCompleted = !validIssues?.length;
      const hasError = !hasCompleted && Boolean(Object.keys(form.formState.errors).length);
      // TODO
      // eslint-disable-next-line no-console
      console.log({ issues, validIssues, formErrors: form.formState.errors, hasError, hasCompleted }, form.formState);
      await table?.update(uid, { hasError, hasCompleted });
    }
  }
  return { result, count, isLoaded: count != null };
}

export function useLoadTable<T>(props: LoadTableProps<T>): LoadTableReturn<T> {
  return useLiveQuery(async () => await initFormValues(props)) ?? {};
}
