import React from 'react';
import { useConditionalCriteria } from '../../hooks/useConditionalCriteria';
import { OptionsViewer } from '../shared/OptionsViewer/OptionsViewer';
import { AbstractFieldProps } from '../fields';

export function Occupancy({ as = 'radio', required }: AbstractFieldProps) {
  const {
    fieldValues: [itemType],
    fields,
    options,
    defaultValue,
  } = useConditionalCriteria('occupancyTypes');

  const question = () => {
    switch (itemType) {
      case 'house':
        return 'House occupancy';
      default:
        return 'Occupancy';
    }
  };

  const scope = {
    source: fields,
    condition: options?.length > 0,
  };

  return (
    <OptionsViewer
      as={as}
      name="occupancy"
      question={question()}
      options={options}
      defaultValue={defaultValue}
      required={required}
      scope={scope}
    />
  );
}
