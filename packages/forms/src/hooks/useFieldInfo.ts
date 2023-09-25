import { FieldValues } from 'react-hook-form';
import { UseFormSetValue } from 'react-hook-form/dist/types/form';
import { useModelContext, useSaveField } from '@fmg/ui';

export type UseFieldInfoProps = {
  sources: string[];
  target?: string;
  delimiter?: string;
};

export type AutoFormatProps<T extends FieldValues = FieldValues> = {
  sources: string[];
  target?: string;
  delimiter?: string;
  getValue: (key: string) => Promise<unknown>;
  setValue?: UseFormSetValue<T>;
};

export async function autoFormat({ sources, target, delimiter = ' ', getValue, setValue }: AutoFormatProps) {
  let del = '';

  const autoFormatted = sources.reduce(async (acc, key) => {
    let out = await acc;
    const join = (val: string) => [out, val].join(delimiter).trim();

    if (key.match(/^\W+$/)) {
      if (out) {
        out = join(key);
        del = key;
      }
    } else {
      const fieldValue = (await getValue(key)) as string;
      if (fieldValue) {
        out = join(fieldValue);
      }
    }

    return out;
  }, Promise.resolve(''));

  const finalValue = (await autoFormatted).replace(new RegExp(`${del}$`), '').trim();

  if (target) {
    const targetValue = await getValue(target);
    if (targetValue != finalValue) {
      setValue?.(target, finalValue);
    }
  }

  return finalValue;
}

export function useFieldInfo({ sources, target, delimiter = ' ' }: UseFieldInfoProps) {
  const { uid, table } = useModelContext();
  const saveField = useSaveField();

  const getValue = async (key: string) => {
    return ((await table?.get(uid)) as Record<string, unknown>)[key];
  };

  const setValue = (name: string, value: unknown) => {
    if (value) {
      //setFormValue(name, value);
      saveField({ name, value });
    }
  };

  return autoFormat({ sources, target, delimiter, getValue, setValue });
}
