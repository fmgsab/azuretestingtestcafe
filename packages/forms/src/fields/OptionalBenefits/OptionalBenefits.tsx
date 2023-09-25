import React from 'react';

import { AbstractFieldProps } from '../fields';
import { useConditionalCriteria } from '../../hooks/useConditionalCriteria';

import { OptionsViewer } from '../shared/OptionsViewer/OptionsViewer';
import { IndividualOptionsViewer } from '../shared/OptionsViewer/IndividualOptionsViewer';

export type OptionalCoverTypeProps = AbstractFieldProps;

export function OptionalBenefits({ as = 'individual', name = 'optionalCovers', ...props }: OptionalCoverTypeProps) {
  // occupancy is only used for house which doesn't affect other coverables when present
  const { fields, options } = useConditionalCriteria('optionalCoverTypes', { fields: ['occupancy'] });
  const condition = options?.length > 0;

  const scope = {
    source: fields,
    condition,
  };

  const otherProps = as === 'list' ? { scope, isMulti: true } : { scope };

  const Component = as === 'individual' ? IndividualOptionsViewer : OptionsViewer;

  return <Component as={as} name={name} question="Optional benefits" {...props} options={options} {...otherProps} />;
}
