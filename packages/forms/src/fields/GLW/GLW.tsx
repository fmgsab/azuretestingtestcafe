import React from 'react';

import { itemSubtypes } from 'models';
import { TextInputWidget } from '@fmg/ui';

import { AbstractFieldProps } from '../fields';

export function GLW(props: AbstractFieldProps) {
  const { atv, drawn, motorbike, wagon, spreader, selfPowered, sprayEquipment, postRammer, powerHarrow, fel, crate } = itemSubtypes.vehicle;

  return (
    <TextInputWidget
      name="glw"
      question="GLW"
      scope={{
        source: 'itemSubtype',
        condition: (itemSubtype) =>
          itemSubtype &&
          ![atv, drawn, motorbike, wagon, spreader, selfPowered, sprayEquipment, postRammer, powerHarrow, fel, crate].includes(itemSubtype),
      }}
      size={5}
      {...props}
    />
  );
}
