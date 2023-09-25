import React from 'react';
import { useConditionalCriteria } from '../../hooks/useConditionalCriteria';
import { AbstractFieldProps } from '../fields';

import { OptionsViewer } from '../shared/OptionsViewer/OptionsViewer';
import dayjs from 'dayjs';

const FIELD_NAME = 'contact';

export function ContactRoles({ as = 'list', hasDefault = true, ...props }: AbstractFieldProps) {
  const { fields, options, defaultValue, fieldValues } = useConditionalCriteria('roles', {
    fields: ['dateOfBirth'],
    // TODO: come to this again
    // hasDefault,
  });

  const [, , , , dateOfBirth] = fieldValues;
  const age = dayjs().diff(dayjs(dateOfBirth), 'year');

  const filteredOptions = options.filter((option: string) => (option === 'Driver' ? age >= 16 : true));
  const validOptions = filteredOptions.length > 0 ? filteredOptions : [options[0]].filter(Boolean);

  const scope = {
    source: fields,
    condition: validOptions?.length > 0,
  };

  return (
    <OptionsViewer as={as} name={FIELD_NAME} question="Roles" {...props} options={validOptions} defaultValue={defaultValue} scope={scope} />
  );
}
