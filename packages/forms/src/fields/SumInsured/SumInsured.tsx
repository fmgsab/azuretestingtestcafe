import React from 'react';
import { RequiredType, SumInsuredWidget, NumericInputWidget } from '@fmg/ui';

import { AbstractFieldProps } from '../fields';

export type SumInsuredProps = AbstractFieldProps & {
  isSingle?: boolean;
  required?: RequiredType;
};

export function SumInsured({ isSingle, ...props }: SumInsuredProps) {
  const { question, name = '', required } = props;

  return isSingle ? (
    <NumericInputWidget {...props} name={name} question={question} required={required} isSumInsured />
  ) : (
    <SumInsuredWidget name="sumInsured" question="Sum Insured" {...props} />
  );
}
