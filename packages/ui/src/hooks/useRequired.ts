import { ZodDefault, ZodEffects, ZodObject, ZodOptional } from 'zod';
import { ZodError, ZodIssueBase } from 'zod/lib/ZodError';
import { useFormContext } from 'react-hook-form';

import { reqMessage } from 'models/src/schemas/schema';
import { RequiredType } from '../types';
import { useModelContext } from '../context/ModelContext';

export function useRequired(name: string, required?: RequiredType) {
  const model = useModelContext();
  const form = useFormContext();

  const { schema } = model ?? {};
  const shape = schema instanceof ZodEffects ? schema.innerType().shape : schema?.shape;
  if (required == null) {
    const fieldShape = shape?.[name];

    if (!fieldShape) return false;

    if (fieldShape instanceof ZodDefault) return true;

    if (fieldShape instanceof ZodObject) {
      const children = fieldShape.shape;
      return Object.values(children).some((child) => !(child instanceof ZodOptional));
    }

    return !(fieldShape.isOptional() || fieldShape.isNullable());
  }

  if (required !== 'deferred') {
    return required;
  }

  const { error: { issues } = {} as ZodError } = schema.safeParse({ ...form.getValues(), [name]: undefined });

  // TODO: take other messages into account
  const isRequired = issues?.some(({ path, message }: ZodIssueBase) => path.includes(name) && message === reqMessage);

  // console.log(name, issues, issues?.filter(({ path, message }: ZodIssueBase) => path.includes(name)), { isRequired });
  if (!isRequired) {
    form.watch(name);
  }

  return isRequired;
}
