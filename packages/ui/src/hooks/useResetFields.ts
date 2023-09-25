import { useCallback } from 'react';
import { useSaveMultiFields } from './useSaveMultiFields';

export function useResetFields(resetValue: unknown = undefined) {
  const saveFields = useSaveMultiFields();

  return useCallback(
    (names: string[]) => {
      const changes: Record<string, unknown> = names.reduce((acc, name) => {
        acc = { ...acc, [name]: resetValue ?? undefined };
        return acc;
      }, {});

      saveFields(changes, true);
    },
    [saveFields, resetValue]
  );
}
