import React from 'react';
import { SumInsuredWidget } from '@fmg/ui';
import { useFormContext } from 'react-hook-form';
import { settlementTypes } from 'models';

const { functionalReplacement, functionalReplacementValue, nominatedReplacementValue } = settlementTypes;

export function ConditionalQuestionSI() {
  const { watch } = useFormContext();
  const basisOfSettlement = watch('basisOfSettlement');

  const question = basisOfSettlement === functionalReplacement ? functionalReplacementValue : nominatedReplacementValue;
  return <SumInsuredWidget name="replacementValue" question={question} required />;
}
