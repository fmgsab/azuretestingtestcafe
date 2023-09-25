import React from 'react';
import * as model from 'models/src/busInterruption.table';
import { itemTypes, itemSubtypes } from 'models';
import {
  FormProviderWrapper,
  type RowKeyType,
  MultiInputWidget,
  RadioGroupWidget,
  NumericInput,
  TextInputWidget,
  NumericInputWidget,
} from '@fmg/ui';

import { ItemSubtype, AddressSelect, SumInsured, Options } from '../fields';
import { DariyProfit } from '../fieldsets/DairyProfit/DariyProfit';

const busInterruption = itemTypes.busInterruption.value;

export function FormBusInterruption({ uid }: { uid: RowKeyType }) {
  // eslint-disable-next-line no-console
  const onSubmit = (data: model.FormValues) => console.log('Submit:', data);
  return (
    <>
      <FormProviderWrapper
        model={model}
        uid={uid}
        onSubmit={onSubmit}
        mode="all"
        // TODO: claimsPrepCosts should be conditional on item subtype
        defaultValues={{ itemType: busInterruption, indemnityPeriod: '12', claimsPrepCosts: '10000' }}
        discriminator="itemSubtype"
      >
        <ItemSubtype required />
        <AddressSelect name="location" question="Location" mode="physical" />
        <TextInputWidget
          placeholder="PLACEHOLDER"
          name="building"
          question="Associated building"
          scope={{ source: 'itemSubtype', condition: itemSubtypes.busInterruption.commercial }}
          required
        />
        <NumericInputWidget
          name="numberOfMilkingCows"
          question="Number of milking cows"
          scope={{ source: 'itemSubtype', condition: itemSubtypes.busInterruption.isDairyFarm }}
          size={4}
          required
        />
        <Options name="indemnityPeriod" lookupKey="indemnityPeriod" question="Indemnity period" hideIfEmpty hasDefault />

        <DariyProfit />
        <SumInsured
          name="annualTurnover"
          question="Annual Gross Profit"
          scope={{ source: 'itemSubtype', condition: !itemSubtypes.busInterruption.isDairyFarm }}
          required
        />

        <SumInsured name="grossProfit" question="Gross Profit" isSingle optedFor="hasGrossProfit" />
        <SumInsured
          name="outstandingDebtors"
          question="Outstanding Debtors"
          scope={{
            source: 'itemSubtype',
            condition: itemSubtypes.busInterruption.isNonHorticultural,
            fieldsToReset: ['hasOutstandingDebtors', 'outstandingDebtors'],
          }}
          isSingle
          optedFor="hasOutstandingDebtors"
        />
        <SumInsured name="addlIncreasedCosts" question="Additional Increased Costs of Working" isSingle optedFor="hasAddlIncreasedCosts" />
        <SumInsured
          name="lossOfRent"
          question="Loss of Rent"
          scope={{
            source: 'itemSubtype',
            condition: itemSubtypes.busInterruption.isNonHorticultural,
            fieldsToReset: ['hasLossOfRent', 'lossOfRent'],
          }}
          isSingle
          optedFor="hasLossOfRent"
        />

        <MultiInputWidget
          name="dualWages"
          question="Dual Wages"
          sizes={[4, 4]}
          scope={{
            source: 'itemSubtype',
            condition: itemSubtypes.busInterruption.isNonHorticultural,
            fieldsToReset: ['hasDualWages', 'dualWages.sumInsured', 'dualWages.initialPeriod'],
          }}
          optedFor="hasDualWages"
        >
          <NumericInput name="sumInsured" isSumInsured label="GST Exclusive" />
          <NumericInput name="initialPeriod" label="Weeks" placeholder="Initial Period" />
        </MultiInputWidget>

        <MultiInputWidget
          name="wagesInLieu"
          question="Wages in Lieu of Notice"
          sizes={[4, 4]}
          scope={{
            source: 'itemSubtype',
            condition: itemSubtypes.busInterruption.isNonHorticultural,
            fieldsToReset: ['hasWagesInLieu', 'wagesInLieu.sumInsured', 'wagesInLieu.numWeeks'],
          }}
          optedFor="hasWagesInLieu"
        >
          <NumericInput name="sumInsured" isSumInsured label="GST Exclusive" />
          <NumericInput name="numWeeks" label="Weeks" placeholder="Number" />
        </MultiInputWidget>

        <SumInsured
          name="claimsPrepCosts"
          placeholder=""
          question="Claims Preparation Costs"
          scope={{ source: 'itemSubtype', condition: itemSubtypes.busInterruption.isNonHorticultural, fieldsToReset: ['claimsPrepCosts'] }}
          isSingle
          required
        />
        <RadioGroupWidget
          name="hasFrostCover"
          question="Frost Cover"
          scope={{ source: 'itemSubtype', condition: itemSubtypes.busInterruption.isHorticultural, fieldsToReset: ['hasFrostCover'] }}
          required
        />
      </FormProviderWrapper>
    </>
  );
}
