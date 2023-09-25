import React from 'react';

import { DropdownWidget } from '@fmg/ui';
import { dd } from 'models/src/data-dictionary/data-dictionary';

import { AbstractFieldProps } from '../fields';

export type InterestedPartiesProps = Omit<AbstractFieldProps, 'onChange' | 'required'> & {
  onChange: (value: unknown) => void;
};

export function InterestedParties(props: InterestedPartiesProps) {
  return (
    <DropdownWidget name="interestedParties" question="Interested parties" {...props} options={dd.get('interestedParties')()} isMulti />
  );
}
