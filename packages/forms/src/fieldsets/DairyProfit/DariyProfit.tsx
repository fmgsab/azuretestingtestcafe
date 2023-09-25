import React, { useLayoutEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import classnames from 'classnames';

import { itemSubtypes } from 'models';
import { toNumber } from '@fmg/utils';
import { Currency, InfoIcon, useResetFields, useSaveField, MultiInputWidget, NumericInput } from '@fmg/ui';

const { isDairyFarm } = itemSubtypes.busInterruption;

export type Factor = number | undefined;

export function calculateDairyProfit([period = 12, peakProduction = 0, estPayout = 0, share = 100]: Factor[]) {
  return (peakProduction * estPayout * (share / 100) * period) / 12;
}

export function DariyProfit() {
  const { getValues } = useFormContext();
  const resetFields = useResetFields();
  const saveField = useSaveField();
  const [itemSubtype, ...values] = getValues(['itemSubtype', 'indemnityPeriod', 'peakProduction', 'estimatedPayout', 'share']);
  const [, , , share] = values;

  useLayoutEffect(() => {
    if (!itemSubtype) return;

    if (isDairyFarm(itemSubtype)) {
      saveField({ name: 'share', value: share ?? '100' });
    } else {
      resetFields(['numberOfMilkingCows', 'peakProduction', 'estimatedPayout', 'share']);
    }
  }, [itemSubtype, share, resetFields, saveField]);

  if (!itemSubtype || !isDairyFarm(itemSubtype)) return null;

  const estDairyProfit = calculateDairyProfit(values.map((value) => (value !== undefined ? toNumber(value) : value)));

  return (
    <>
      <MultiInputWidget question="Gross Profit Calculator" sizes={[4, 3, 3]} name="" required>
        <NumericInput name="peakProduction" label="Annual milk solid production" required isSumInsured placeholder="GST Exclusive" />
        <NumericInput name="estimatedPayout" label="Milk payout ($ per kgMS)" decimalScale={2} required isCurrency />
        <NumericInput name="share" label="Share" suffix="%" decimalScale={2} required />
      </MultiInputWidget>
      <span className={classnames('form-fields flex gap-1.5')} data-testid="estDairyProfit">
        <InfoIcon className={classnames('fill-fmg-green')} />
        Estimated Gross Profit: <Currency value={estDairyProfit} />
        (GST Exclusive)
      </span>
    </>
  );
}
