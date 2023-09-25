import React from 'react';
import { TextInputWidget } from '@fmg/ui';

import { AbstractFieldProps } from '../fields';

export function Serial(props: AbstractFieldProps) {
  return (
    <TextInputWidget
      name="serial"
      question="Serial"
      scope={{
        source: 'itemSubtype',
        condition: (itemSubtype) => Boolean(itemSubtype),
      }}
      size={5}
      {...props}
    />
  );
}
