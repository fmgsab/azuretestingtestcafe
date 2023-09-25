import React from 'react';

import { toNumber } from '@fmg/utils';
import { useConditionalCriteria } from '../../hooks/useConditionalCriteria';
import { AbstractFieldProps } from '../fields';

import { OptionsViewer } from '../shared/OptionsViewer/OptionsViewer';
import { Options, OptionsProps } from '../shared/Options/Options';

const FIELD_NAME = 'excess';

export function Excess({ as = 'radio', hasDefault = true, ...props }: AbstractFieldProps) {
  const { fields, options, defaultValue, fieldValues } = useConditionalCriteria('excesses', {
    fields: ['sumInsured.gstExclusive'],
    hasDefault,
  });

  const [, , , , sumInsured] = fieldValues;
  const filteredOptions = options.filter((option: string) => toNumber(option) < toNumber(sumInsured));
  const validOptions = filteredOptions.length > 0 ? filteredOptions : [options[0]].filter(Boolean);

  const scope = {
    source: fields,
    condition: validOptions?.length > 0,
  };

  return (
    <OptionsViewer
      as={as}
      name={FIELD_NAME}
      question="Excess"
      {...props}
      options={validOptions}
      defaultValue={defaultValue}
      scope={scope}
    />
  );
}

// TODO: consolidate the below two functions into one if there becomes more than two
export function ExcessHouse({ as = 'radio', hasDefault = true, ...props }: OptionsProps) {
  return (
    <Options
      as={as}
      name={FIELD_NAME}
      question="Excess"
      lookupKey="excesses"
      required
      fields={['occupancy']}
      hasDefault={hasDefault}
      hideIfEmpty
      {...props}
    />
  );
}

export function ExcessContents({ as = 'radio', hasDefault = true, ...props }: OptionsProps) {
  return (
    <Options
      as={as}
      name={FIELD_NAME}
      question="Excess"
      lookupKey="excesses"
      hasDefault={hasDefault}
      hideIfEmpty
      required={true}
      {...props}
    />
  );
}
