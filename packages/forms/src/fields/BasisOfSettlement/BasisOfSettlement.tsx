import React from 'react';
import { useConditionalCriteria } from '../../hooks/useConditionalCriteria';
import { OptionsViewer } from '../shared/OptionsViewer/OptionsViewer';
import { AbstractFieldProps } from '../fields';
import { nq } from 'models';

export function BasisOfSettlement({ as = 'radio', name = nq.basisOfSettlement.name }: AbstractFieldProps) {
  const { options, defaultValue } = useConditionalCriteria('settlementTypes');

  return (
    <OptionsViewer
      as={as}
      name={name}
      question={nq.basisOfSettlement.question}
      required={true}
      options={options}
      defaultValue={defaultValue}
    />
  );
}
