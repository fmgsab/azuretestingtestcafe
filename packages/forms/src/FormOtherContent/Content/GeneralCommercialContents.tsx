import { TextInputWidget } from '@fmg/ui';
import { AddressSelect, ExcessContents, Options } from '../../fields';
import { TableData, TableSearchArgs } from '../../fields/TableData/TableData';
import { BasisOfSettlementSumInsured } from '../../fieldsets/BasisOfSettlementSumInsured/BasisOfSettlementSumInsured';
import React from 'react';

export const GeneralCommercialContents = ({ tableSearchArgs }: { tableSearchArgs: TableSearchArgs[] }) => {
  return (
    <>
      <TextInputWidget name="name" question="Client description" maxLength={255} required={false} />
      <AddressSelect name="location" question="Location" mode="physical" />
      <TableData
        name="contentsKeptIn"
        question="Building General Commercial Contents are stored in"
        tableSearchArgs={tableSearchArgs}
        required
      />
      <Options name="insuredEvent" question="Insured event" lookupKey="insuredEvents" hasDefault={true} hideIfEmpty />

      <BasisOfSettlementSumInsured />

      <ExcessContents hasDefault={false} />
    </>
  );
};
