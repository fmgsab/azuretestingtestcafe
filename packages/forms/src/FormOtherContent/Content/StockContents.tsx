import { RadioGroupWidget, Scope, TextInputWidget } from '@fmg/ui';
import { AddressSelect, ExcessContents, Options, SumInsured } from '../../fields';
import { TableData, TableSearchArgs } from '../../fields/TableData/TableData';

export const StockContents = ({ tableSearchArgs }: { tableSearchArgs: TableSearchArgs[] }) => {
  return (
    <>
      <TextInputWidget name="name" question="Client description" maxLength={255} required={false} />
      <AddressSelect name="location" question="Location" mode="physical" />
      <TableData
        name="contentsKeptIn"
        question="&nbsp;Building General Commercial Contents are stored in"
        tableSearchArgs={tableSearchArgs}
        required
      />
      <Options name="insuredEvent" question="Insured event" lookupKey="insuredEvents" hasDefault={true} hideIfEmpty />
      <SumInsured name="sumInsured" question="Sum Insured" required />
      <ExcessContents hasDefault={false} />

      <Scope highlight>
        <Scope.Source>
          <RadioGroupWidget
            name="stockContamination"
            question="&nbsp;Contamination, spoilage, or deterioration of Honey, Wine or Olive oil"
            required
          />
        </Scope.Source>

        <Scope.Target condition="true">
          <Options name="contaminationType" question="Contamination type" lookupKey="contaminationTypes" required />
          <SumInsured
            name="stockContaminationSumInsured"
            question="Sum Insured"
            scope={{
              fieldsToReset: ['contaminationType'],
              resetValue: {},
            }}
            required
          />
        </Scope.Target>
      </Scope>

      <Scope highlight>
        <Scope.Source>
          <RadioGroupWidget name="seasonalStockIncrease" question="Seasonal stock increase" required />
        </Scope.Source>

        <Scope.Target condition="true" required>
          <Options name="seasonalStockPeriod" question="4 month period" lookupKey="seasonalStockIncrease" required />
        </Scope.Target>
      </Scope>
    </>
  );
};
