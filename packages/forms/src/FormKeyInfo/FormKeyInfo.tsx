import React from 'react';
import * as model from 'models/src/keyInfo.table';
import {
  AffixInputWidget,
  FormProviderWrapper,
  RowKeyType,
  MultiInputWidget,
  RadioGroupWidget,
  Scope,
  TextInput,
  TextInputWidget,
} from '@fmg/ui';
import { Options } from '../fields';
import { Phone } from '../fieldsets/Phone/Phone';
import { Email } from '../fieldsets/Email/Email';

export function FormKeyInfo({ uid }: { uid: RowKeyType }) {
  // TODO - This is a failsafe while the app is still in dev
  if (!uid) return null;

  // eslint-disable-next-line no-console
  const onSubmit = (data: model.FormValues) => console.log('Submit:', data);

  return (
    <>
      <FormProviderWrapper
        model={model}
        uid={uid}
        onSubmit={onSubmit}
        mode="all"
        defaultValues={{
          deliveryPreference: 'Email',
          fmgPost: 'true',
          fmgAdviceOffers: 'true',
          needsWelcomePack: 'true',
        }}
      >
        <Options as="list" name="accountType" question="Account Type" lookupKey="accountTypes" />
        <TextInputWidget name="accountName" question="Account Name" />
        <TextInputWidget
          name="companyName"
          question="Company Legal Name"
          scope={{
            source: 'accountType',
            condition: (type) => !['Person', 'Collective'].includes(type),
          }}
          required="deferred"
        />
        <Options name="accountSegment" question="Account Segment" lookupKey="accountSegments" />
        {/*<AddressSelect name="location" question="#WILL CHANGE# Account Address" />*/}
        <MultiInputWidget name="" question="Salutation & Mail name" sizes={[3, 7]} required saveOnChange>
          <TextInput name="salutation" label="Salutation" placeholder="Dear..." />
          <TextInput name="mailName" label="Mail name" deferValidation />
        </MultiInputWidget>
        <Phone question="Phone" sizes={[4, 6]} />
        <Email />
        <RadioGroupWidget name="deliveryPreference" question="Statement delivery preference" options={['Email', 'Post']} />
        <RadioGroupWidget name="fmgPost" question="FMG Post?" />
        <RadioGroupWidget
          name="fmgAdviceOffers"
          question="FMG Advice and Offers?"
          scope={{
            source: 'accountType',
            condition: (type) => type !== 'Person',
          }}
        />
        <RadioGroupWidget name="needsWelcomePack" question="Welcome pack needed?" />
        <Options name="paymentFrequency" question="Payment frequency" lookupKey="paymentFrequencies" />
        <Scope highlight>
          <Scope.Source>
            <Options name="paymentMethod" question="Payment method" lookupKey="paymentMethods" />
          </Scope.Source>
          <Scope.Target condition={(val) => val && val !== 'FMG'}>
            <AffixInputWidget name="shareholderNumber" label="Shareholder Number" thousandSeparator={false} required={false} size={5} />
          </Scope.Target>
        </Scope>
      </FormProviderWrapper>
    </>
  );
}
