import * as React from 'react';
import { RadioGroupWidget, TextareaWidget } from '@fmg/ui';
import { usages, itemSubtypes } from 'models';

const { cvu, trailer, atv, truck, drawn, digger, utv, motorbike, irrigatorCentre, irrigatorLinear, irrigatorTravelling } =
  itemSubtypes.vehicle;

const showListHazardousSubtypes = [cvu, trailer, atv, truck, drawn, digger, utv, motorbike];
const irrigators = [irrigatorCentre, irrigatorLinear, irrigatorTravelling];

export function CommercialActivities() {
  return (
    <>
      <TextareaWidget
        name="commercialActivitiesDescription"
        question="Commercial Activities Description"
        scope={{
          source: ['itemSubtype', 'usage'],
          condition: ([itemSubtype, usage]) => usage && usages.commercial === usage && !irrigators.includes(itemSubtype),
        }}
      />
      <RadioGroupWidget
        name="hasHazardousGoods"
        question="Hazardous Goods"
        defaultValue="false"
        scope={{
          source: ['itemSubtype', 'usage'],
          condition: ([itemSubtype, usage]) => usage && usages.commercial === usage && showListHazardousSubtypes.includes(itemSubtype),
        }}
      />
      <TextareaWidget
        name="hazardousGoodsDescription"
        label="Description"
        scope={{
          source: ['itemSubtype', 'usage', 'hasHazardousGoods'],
          condition: ([itemSubtype, usage, hasHazardousGoods]) =>
            usage === usages.commercial && hasHazardousGoods === 'true' && showListHazardousSubtypes.includes(itemSubtype),
        }}
      />
    </>
  );
}
