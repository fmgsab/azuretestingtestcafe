import { useCallback } from 'react';
import { useFormContext } from 'react-hook-form';

export function useSetValueRecursively() {
  const { watch, setValue } = useFormContext();

  const setValueRecursively = useCallback(
    (fieldName: string, value: unknown) => {
      const nestedValues = watch(fieldName);

      if (typeof nestedValues === 'object') {
        const keys = Object.keys(nestedValues);
        keys.forEach((key) => {
          setValueRecursively(`${fieldName}.${key}`, value);
        });
      } else {
        setValue(fieldName, value);
      }
    },
    [setValue, watch]
  );

  return setValueRecursively;
}
