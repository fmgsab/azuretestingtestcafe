import React from 'react';
import { content as model } from 'models';
import {
  AffixInputWidget,
  Button,
  FormProviderWrapper,
  RowKeyType,
  RadioGroupWidget,
  Scope,
  SumInsuredWidget,
  TextInputWidget,
} from '@fmg/ui';

import { AddressSelect, BasisOfSettlement, ExcessContents, ItemSubtype, Occupancy, Options } from '../fields';
import { SpecifiedItems } from '../fieldsets';
import { v4 } from 'uuid';

export function FormContent({ uid }: { uid: RowKeyType }) {
  // eslint-disable-next-line no-console
  const onSubmit = (data: model.FormValues) => {
    // TODO: remove related values from submit payload when required fields are false
    if (data.hasSpecifiedItems === 'false') {
      data.specifiedItems = [];
    }

    const sucess = model.schema.safeParse(data).success;
    if (sucess) {
      // eslint-disable-next-line no-console
      console.log('sucesss', data);
    }
  };

  return (
    <>
      <FormProviderWrapper
        model={model}
        uid={uid}
        onSubmit={onSubmit}
        shouldResetForm={true}
        mode="all"
        defaultValues={{
          specifiedItems: [
            {
              key: v4(),
            },
          ],
          itemType: 'content',
          isBodyCorpManaged: 'false',
        }}
      >
        <ItemSubtype />
        <AddressSelect name="location" question="Location" mode="physical" />
        <TextInputWidget name="name" question="Client description" maxLength={255} required={false} />
        <Occupancy required={true} />
        <Scope highlight>
          <Scope.Source>
            <RadioGroupWidget name="hasContentsInStorage" question="Contents in storage" />
          </Scope.Source>
          <Scope.Target condition="true">
            <AffixInputWidget
              name="valueOfContentsInStorage"
              question="Value of contents in storage"
              prefix="$"
              size={5}
              maxLength={12}
              required
            />
          </Scope.Target>
        </Scope>
        <Scope highlight>
          <Scope.Source>
            <RadioGroupWidget name="isCommercialUse" question="Commercial use" />
          </Scope.Source>
          <Scope.Target condition="true">
            <TextInputWidget name="occupation" question="Occupation" required />
          </Scope.Target>
        </Scope>
        <RadioGroupWidget name="hasShortTermGuest" question="Short term paying guests" required="deferred" />
        <Scope highlight>
          <Scope.Source>
            <RadioGroupWidget name="isBodyCorpManaged" question="Body corporate managed building" />
          </Scope.Source>
          <Scope.Target condition="true">
            <RadioGroupWidget name="hasFixedCarpetCover" question="Fixed carpet cover" required />
          </Scope.Target>
        </Scope>
        <Options name="waterSupply" question="Water supply" lookupKey="waterSupplyTypes" />
        <RadioGroupWidget
          name="hasUnRepairedEqcDamage"
          question="Unrepaired earthquake damage"
          options={[
            { label: 'Yes', value: 'true' },
            { label: 'No', value: 'false' },
            { label: "Don't Know", value: 'unsure' },
          ]}
        />
        <BasisOfSettlement />
        <SumInsuredWidget name="sumInsured" question="Sum insured" required />
        <ExcessContents />
        <RadioGroupWidget
          name="lifeStyleBlockContents"
          question="Lifestyle block contents"
          options={[
            { label: 'Yes', value: 'true' },
            { label: 'No', value: 'false' },
          ]}
        />
        <SpecifiedItems />

        <Button aria-label="" color="primary" className="col-span-2 m-10" block>
          Submit
        </Button>
      </FormProviderWrapper>
    </>
  );
}
