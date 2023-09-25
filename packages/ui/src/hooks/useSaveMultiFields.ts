import { useCallback } from 'react';
import { useFormContext } from 'react-hook-form';
import { useModelContext } from '../context/ModelContext';

export function useSaveMultiFields() {
  const { table, uid } = useModelContext();
  const { setValue, resetField } = useFormContext() ?? {};

  return useCallback(
    (changes: Record<string, unknown>, updateFormState = false) => {
      if (updateFormState && setValue) {
        Object.entries(changes).forEach(([key, value]) => {
          setValue(key, value);
          resetField(key);
        });
      }

      table?.update(uid, changes).then(function (updated: number) {
        if (updated) {
          // eslint-disable-next-line no-console
          console.log(`${changes} applied to ${table.name}#${uid}`);
        } else {
          // eslint-disable-next-line no-console
          table.add(changes, uid).then((data) => console.log(`${{ data }} added to ${table.name}#${uid}`));
        }
      });
    },
    [resetField, setValue, table, uid]
  );
}
