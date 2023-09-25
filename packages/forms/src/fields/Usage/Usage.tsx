import React from 'react';

import { useConditionalCriteria } from '../../hooks/useConditionalCriteria';
import { AbstractFieldProps } from '../fields';

import { OptionsViewer } from '../shared/OptionsViewer/OptionsViewer';

export function Usage({ name = 'usage', as = 'radio', required, ...props }: AbstractFieldProps) {
  const {
    fields,
    fieldValues: [itemType],
    options,
    defaultValue,
  } = useConditionalCriteria('usages');

  // TODO: separate out into a util function
  const question = () => {
    switch (itemType) {
      case 'vehicle':
        return 'Vehicle usage';
      default:
        return 'Usage';
    }
  };

  const scope = {
    source: fields,
    condition: options?.length > 0,
  };

  return (
    <OptionsViewer
      {...props}
      scope={scope}
      as={as}
      name={name}
      question={question()}
      options={options}
      defaultValue={defaultValue}
      required={required}
    />
  );
}
