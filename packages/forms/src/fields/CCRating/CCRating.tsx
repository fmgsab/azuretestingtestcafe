import React from 'react';
import { itemSubtypes } from 'models';
import { TextInputWidget } from '@fmg/ui';

import { AbstractFieldProps } from '../fields';

export function CCRating(props: AbstractFieldProps) {
  const {
    trailer,
    drawn,
    irrigatorCentre,
    mower,
    wagon,
    caravan,
    spreader,
    irrigatorTravelling,
    horseFloat,
    baler,
    sprayEquipment,
    postRammer,
    powerHarrow,
    fel,
    irrigatorLinear,
    roundBaler,
    crate,
  } = itemSubtypes.vehicle;

  return (
    <TextInputWidget
      name="ccRating"
      question="CC rating"
      required="deferred"
      scope={{
        source: 'itemSubtype',
        condition: (itemSubtype) =>
          itemSubtype &&
          ![
            trailer,
            drawn,
            irrigatorCentre,
            mower,
            wagon,
            caravan,
            spreader,
            irrigatorTravelling,
            horseFloat,
            baler,
            sprayEquipment,
            postRammer,
            powerHarrow,
            fel,
            irrigatorLinear,
            roundBaler,
            crate,
          ]?.includes(itemSubtype),
      }}
      size={5}
      {...props}
    />
  );
}
