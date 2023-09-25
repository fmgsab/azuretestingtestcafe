import React from 'react';
import { contact as model } from 'models';
import { dd } from 'models/src/data-dictionary/data-dictionary';
import { RadioGroupWidget, TextInputWidget, Scope, FormProviderWrapper } from '@fmg/ui';
import { Phone } from '../fieldsets/Phone/Phone';
import { ContactRoles } from '../fields/ContactRoles/ContactRoles';
import { LossOfLicence } from '../fieldsets/LossOfLicence/LossOfLicence';
import { Accidents } from '../fieldsets/Accidents/Accidents';
import { v4 } from 'uuid';
import { Email } from '../fieldsets/Email/Email';
import { Name } from "../fieldsets/Name/Name";

export function FormContact(props = {}) {
  const onSubmit = (data: model.FormValues) => console.log('Submit:', data, props);

  return (
    <FormProviderWrapper
      model={model}
      uid={1}
      onSubmit={onSubmit}
      mode="all"
      defaultValues={{
        accident: [{key: v4(), type: "At fault"}],
        lossOfLicence: [{key: v4()}],
      }}
      {...props}
    >
      <Name/>
      <Phone question="Phone" sizes={[4, 6]}/>
      <Email/>
      <TextInputWidget name="address" question="Address" placeholder="To be address lookup"/>
      <Scope>
        <Scope.Source>
          <ContactRoles isMulti defaultValue="" placeholder="Select" hasDefault name="roles"/>
        </Scope.Source>
        <Scope.Target condition={(val: string[]) => (val !== undefined ? val.includes('Driver') : false)}>
          <RadioGroupWidget required={true} name="licenceType" question="Licence type"
                            options={dd.get('licenceTypes')()}/>
          <LossOfLicence/>
          <Accidents/>
        </Scope.Target>
      </Scope>
    </FormProviderWrapper>
  );
}
