import React, { forwardRef } from 'react';
import { FieldProps, useSaveField } from '@fmg/ui';
import { Options, OptionsProps } from '../shared/Options/Options';
import { toNumber } from '@fmg/utils';

type SumInsuredOptions = Omit<FieldProps, 'fields' | 'component'> & { lookupKey?: string } & OptionsProps;

const SAFE_DPs = 5;

function safeNumber(n: number) {
  return Math.trunc(n * 10 ** SAFE_DPs) / 10 ** SAFE_DPs;
}

function useHandleChange(field: string) {
  const saveField = useSaveField();

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { value } = e.target;

    if (value === 'Other') {
      return;
    }

    const exGst = safeNumber(toNumber(value));
    const incGst = Math.round(toNumber(value) * 1.15);

    saveField({ name: `${field}.gstExclusive`, value: String(exGst) }, true);
    saveField({ name: `${field}.gstInclusive`, value: String(incGst) }, true);
  }

  return handleChange;
}

export const SumInsuredWithOptions = forwardRef<HTMLInputElement, SumInsuredOptions>(function CustomInput(props: SumInsuredOptions, ref) {
  const handleChange = useHandleChange('sumInsured');
  const mergedProps = { ...props, ref, onChange: handleChange };
  return <Options {...mergedProps} lookupKey="sumInsured" />;
});
