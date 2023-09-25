import { CustomDropdownProps, OptionProps } from '../../types/input-types';

export function isOption(option: OptionProps | unknown): option is OptionProps {
  return (option as OptionProps)?.value !== undefined || (option as OptionProps)?.label !== undefined;
}

export function isOptions(options: OptionProps[] | unknown): options is OptionProps[] {
  return Array.isArray(options) && isOption(options[0]);
}

export function isPlaceholder(data: OptionProps | unknown): boolean {
  return isOption(data) && data.value === '';
}

export function extractValues(selection: unknown) {
  const getValue = (option: OptionProps) => option.value;
  if (isOptions(selection)) return selection.map(getValue);
  if (isOption(selection)) return getValue(selection);
  return selection;
}

export function useOptions(options: OptionProps[] | unknown) {
  const getOptionValues = (selection: OptionProps[] | unknown) => {
    if (isOption(selection)) {
      return [selection.value];
    }

    if (isOptions(selection)) {
      return selection.map((option) => option.value);
    }

    return Array.isArray(selection) ? selection : [selection];
  };

  return (selection: OptionProps | OptionProps[] | unknown) => {
    if (selection == null) return undefined;

    return isOptions(options)
      ? options?.filter((op) => {
          return getOptionValues(selection).includes(op.value) || getOptionValues(selection) === op.value;
        })
      : [selection];
  };
}

export function convertToOptions(data: OptionProps[] | string[] | number[], mapExtra: CustomDropdownProps['mapExtra'] = undefined) {
  return data.map((option, idx) => {
    const extra = mapExtra?.(option, idx) ?? {};
    return isOption(option) ? { ...option, ...extra } : { id: String(idx), value: option, label: String(option), ...extra };
  });
}

export function convertToPrimitiveArray(data: OptionProps[] | string[] | number[]) {
  return data.map((option) => {
    return isOption(option) ? option.label : option;
  });
}

export function getLabel(key: unknown, dataSource: OptionProps[]): unknown | string {
  return dataSource.find((option) => option?.value && option.value === key)?.label;
}
