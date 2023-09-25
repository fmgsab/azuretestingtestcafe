import React, { ReactElement, forwardRef } from 'react';

import { debounce, toNumber } from '@fmg/utils';
import { type FieldGroupProps } from '../../../types';
import { useSaveField, useFormFieldGroup, useScope } from '../../../hooks';
import { AffixInput, AffixInputProps } from '../../atoms/AffixInput/AffixInput';

type TwinWidgetProps = Omit<FieldGroupProps, 'fields'> & {
  sizes?: number[];
  inputs: { label: string; name: string; suffix?: string; prefix?: string }[];
  conversionFactor: number;
  decimalAccuracy?: number;
};
type TwinProps = Omit<AffixInputProps, 'fields'> & {
  namePairs: string[];
  conversionFactor: number;
  decimalAccuracy?: number;
};

const DEFAULT_GROUP_NAME = 'pairInput';
const SAFE_DPs = 5;

function safeNumber(n: number) {
  return Math.trunc(n * 10 ** SAFE_DPs) / 10 ** SAFE_DPs;
}

export function truthyOrString(v: string | number) {
  return v || '';
}

function useHandleChange(
  groupName: string | undefined = DEFAULT_GROUP_NAME,
  namePairs = ['pairName0', 'pairName1'],
  conversionFactor: number,
  decimalAccuracy?: number
) {
  const saveField = useSaveField();

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const prefix = `${groupName}.`;
    const { name, value } = e.target;

    const thisName = name.replace(prefix, '');
    const otherName = namePairs.filter((n) => n !== thisName)[0];

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

    if (otherName === namePairs[1]) {
      otherValue = safeNumber(otherValue * conversionFactor);
    }

    if (otherName === namePairs[0]) {
      otherValue = safeNumber(otherValue / conversionFactor);
    }

    otherValue = decimalAccuracy ? Number(otherValue.toFixed(decimalAccuracy)) : Math.round(otherValue);

    // console.log({ name, prefix, thisName, thisValue, otherName, otherValue });
    save(thisName, String(thisValue));
    save(otherName, String(otherValue));
  }

  const [debounceFn] = debounce(handleChange, 250);
  return debounceFn;
}

export const TwinInputWidget = ({
  scope = {},
  question = 'Sum Insured',
  name = DEFAULT_GROUP_NAME,
  sizes = [5, 5],
  inputs = [
    { label: 'input1', name: 'input1', prefix: '#' },
    { label: 'input1', name: 'input1', suffix: '#' },
  ],
  conversionFactor,
  decimalAccuracy = 0,
  ...props
}: TwinWidgetProps): ReactElement => {
  const affixes = [
    { [inputs[0]?.prefix ? 'prefix' : 'suffix']: inputs[0]?.prefix ?? inputs[0]?.suffix },
    { [inputs[1]?.prefix ? 'prefix' : 'suffix']: inputs[1]?.prefix ?? inputs[1]?.suffix },
  ];
  const namePairs = [inputs[0].name, inputs[1].name];

  const { render } = useFormFieldGroup({
    isMultiInput: true,
    fields: [
      {
        component: TwinInput,
        name: `${name}.${inputs[0].name}`,
        label: inputs[0].label,
        placeholder: inputs[0].label,
        size: sizes[0],
        'data-group-name': name,
        namePairs,
        conversionFactor,
        decimalAccuracy,
        ...affixes[0],
      },
      {
        component: TwinInput,
        name: `${name}.${inputs[1].name}`,
        label: inputs[1].label,
        placeholder: inputs[1].label,
        size: sizes[1],
        'data-group-name': name,
        namePairs,
        conversionFactor,
        decimalAccuracy,
        ...affixes[1],
      },
    ],
    name,
    question,
    ...props,
  });
  const { isVisible } = useScope(scope);

  return isVisible ? render() : <></>;
};

export const TwinInput = forwardRef<HTMLInputElement, TwinProps>(function CustomInput(props: TwinProps, ref) {
  const groupName = props['data-group-name'];
  const { namePairs, conversionFactor, decimalAccuracy, ...rest } = props;
  const handleChange = useHandleChange(groupName, namePairs, conversionFactor, decimalAccuracy);
  return (
    <AffixInput
      {...rest}
      onChange={handleChange}
      ref={ref}
      allowLeadingZeros={false}
      decimalScale={decimalAccuracy}
      showErrorIcon={false}
      isNumeric={true}
    />
  );
});
