import React, { ReactElement, forwardRef } from 'react';

import { debounce, toNumber } from '@fmg/utils';
import { type FieldGroupProps } from '../../../types';
import { useSaveField, useFormFieldGroup, useScope } from '../../../hooks';
import { AffixInput, AffixInputProps } from '../../atoms/AffixInput/AffixInput';

type SumInsuredWidgetProps = Omit<FieldGroupProps, 'fields' | 'name'> & { name?: string; sizes?: number[] };
type SumInsuredProps = Omit<AffixInputProps, 'fields'>;

const otherGst = {
  gstInclusive: 'gstExclusive',
  gstExclusive: 'gstInclusive',
};

const DEFAULT_GROUP_NAME = 'sumInsured';
const SAFE_DPs = 5;

function safeNumber(n: number) {
  return Math.trunc(n * 10 ** SAFE_DPs) / 10 ** SAFE_DPs;
}

function useHandleChange(groupName: string | undefined = DEFAULT_GROUP_NAME) {
  const saveField = useSaveField();

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const prefix = `${groupName}.`;
    const { name, value } = e.target;

    const thisName = name.replace(prefix, '');
    const otherName = otherGst[thisName as keyof typeof otherGst];

    const save = (name: string, val: string) => {
      saveField({ name: `${prefix}${name}`, value: val }, true);
    };

    if (!value) {
      save(thisName, '');
      save(otherName, '');
      return;
    }

    const thisValue = toNumber(value);
    let otherValue = thisValue;

    if (otherName === 'gstInclusive') {
      otherValue = safeNumber(otherValue * 1.15);
    }

    if (otherName === 'gstExclusive') {
      otherValue = safeNumber(otherValue / 1.15);
    }

    otherValue = Math.round(otherValue);

    // console.log({ name, prefix, thisName, thisValue, otherName, otherValue });
    save(thisName, String(thisValue));
    save(otherName, String(otherValue));
  }

  const [debounceFn] = debounce(handleChange, 250);
  return debounceFn;
}

export const SumInsuredWidget = ({
  scope = {},
  question = 'Sum Insured',
  name = DEFAULT_GROUP_NAME,
  sizes = [5, 5],
  ...props
}: SumInsuredWidgetProps): ReactElement => {
  const sumInsured = {
    gstExclusive: { label: 'GST Exclusive' },
    gstInclusive: { label: 'GST Inclusive' },
  };

  const { render } = useFormFieldGroup({
    isMultiInput: true,
    fields: [
      {
        component: SumInsured,
        name: `${name}.gstExclusive`,
        label: sumInsured.gstExclusive.label,
        placeholder: sumInsured.gstExclusive.label,
        size: sizes[0],
        'data-group-name': name,
        disabled: props.disabled,
      },
      {
        component: SumInsured,
        name: `${name}.gstInclusive`,
        label: sumInsured.gstInclusive.label,
        placeholder: sumInsured.gstInclusive.label,
        size: sizes[1],
        'data-group-name': name,
        disabled: props.disabled,
      },
    ],
    name,
    question,
    ...props,
  });
  const { isVisible } = useScope(scope);

  return isVisible ? render() : <></>;
};

export const SumInsured = forwardRef<HTMLInputElement, SumInsuredProps>(function CustomInput(props: SumInsuredProps, ref) {
  const groupName = props['data-group-name'];
  const handleChange = useHandleChange(groupName);
  return (
    <AffixInput
      {...props}
      onChange={handleChange}
      prefix="$"
      ref={ref}
      allowLeadingZeros={false}
      decimalScale={0}
      showErrorIcon={false}
      isNumeric={true}
    />
  );
});
