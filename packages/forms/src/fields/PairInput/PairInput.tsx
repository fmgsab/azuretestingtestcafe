import React from 'react';
import { SumInsuredWidget } from '@fmg/ui';

import { AbstractFieldProps } from '../fields';

export function PairInput(props: AbstractFieldProps) {
  return <SumInsuredWidget name="sumInsured" question="Sum Insured" {...props} />;
}
