import { ControllerRenderProps } from 'react-hook-form/dist/types/controller';
import { useModelContext } from '../context/ModelContext';
import { useFormContext } from 'react-hook-form';
import { useCallback } from 'react';

export function useSaveField() {
  const { table, uid } = useModelContext();
  const { setValue, resetField } = useFormContext() ?? {};

  return useCallback(
    (field: Pick<ControllerRenderProps, 'name' | 'value'>, updateFormState = false) => {
      const { name, value } = field;

      if (updateFormState && setValue) {
        resetField(name);
        setValue(name, value);
      }

      table?.update(uid, { [name]: value, hasStarted: true }).then(function (updated: number) {
        if (updated) {
          // eslint-disable-next-line no-console
          console.log(`${name} updated with ${value} ${uid}`);
        } else {
          // eslint-disable-next-line no-console
          table.add({ [name]: value, id: uid }).then((data) => console.log(`${data}: ${name} added with ${value}`));
        }
      });
    },
    [setValue, resetField, table, uid]
  );
}
