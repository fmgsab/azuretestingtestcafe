import { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { useSaveField } from './useSaveField';
import { useSetValueRecursively } from './useSetValueRecursively';

export type UseOptInProps = {
  name: string;
  optedFor?: string;
};

export function useOptIn({ name, optedFor = '' }: UseOptInProps) {
  const { resetField, watch } = useFormContext();
  const save = useSaveField();
  const setValues = useSetValueRecursively();

  const optedIn = Boolean(optedFor) && watch(optedFor);
  const optedOut = Boolean(optedFor) && !watch(optedFor);

  useEffect(() => {
    if (optedOut) {
      save({ name, value: '' });
      setValues(name, '');
      resetField(name);
    }
  }, [save, name, resetField, optedOut, setValues]);

  useEffect(() => {
    if (!optedFor) return;
    save({ name: optedFor, value: optedIn }, true);
  }, [save, optedFor, optedIn]);

  return { optedIn, optedOut };
}
