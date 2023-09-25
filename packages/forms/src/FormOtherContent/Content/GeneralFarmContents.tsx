import React from 'react';
import { RadioGroupWidget, TextInputWidget } from '@fmg/ui';
import { AddressSelect, ExcessContents, Options } from '../../fields';
import { BasisOfSettlementSumInsured } from '../../fieldsets/BasisOfSettlementSumInsured/BasisOfSettlementSumInsured';

export const GeneralFarmContents = () => {
  return (
    <>
      <TextInputWidget name="name" question="Client description" maxLength={255} required={false} />
      <AddressSelect name="location" question="Location" mode="physical" />
      <Options name="insuredEvent" question="Insured event" lookupKey="insuredEvents" hasDefault={true} />
      <BasisOfSettlementSumInsured />
      <ExcessContents hasDefault={false} />
      <RadioGroupWidget name="preventionOfAccess" question="Prevention of access $10,000" required />
    </>
  );
};
