import { ZodEffects, ZodOptional, ZodString, ZodTypeAny } from 'zod';

import { useModelContext } from '../context/ModelContext';

export function useFieldSize(name: string, size?: number) {
  const model = useModelContext();

  const getMaxLength = (shape: ZodTypeAny) => {
    if (shape instanceof ZodString) {
      return shape.maxLength ?? -1;
    }
    return -1;
  };

  // TODO: to be re-defined
  const evalSize = (length: number) => {
    if (length > 0 && length < 30) {
      return 5;
    }
    return 10;
  };

  const { schema } = model ?? {};
  if (size == null) {
    const fieldShape = schema?.shape?.[name];

    if (fieldShape instanceof ZodOptional) {
      return evalSize(getMaxLength(fieldShape.unwrap()));
    }
    if (fieldShape instanceof ZodEffects) {
      return evalSize(getMaxLength(fieldShape.innerType()));
    }

    return evalSize(getMaxLength(fieldShape));
  }

  return size;
}
