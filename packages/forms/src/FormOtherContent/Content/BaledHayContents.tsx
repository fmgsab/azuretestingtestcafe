import { TextInputWidget } from '@fmg/ui';
import { AddressSelect, ExcessContents, Options, SumInsured } from '../../fields';

export const BaledHayContents = () => {
  return (
    <>
      <TextInputWidget name="name" question="Client description" maxLength={255} required={false} />
      <AddressSelect name="location" question="Location" mode="physical" />
      <Options name="storageType" question="Storage Location" lookupKey="storages" hideIfEmpty required />
      <Options name="insuredEvent" question="Insured event" lookupKey="insuredEvents" hasDefault={true} hideIfEmpty />
      <SumInsured name="sumInsured" question="Sum Insured" required />
      <ExcessContents hasDefault={false} />
    </>
  );
};
