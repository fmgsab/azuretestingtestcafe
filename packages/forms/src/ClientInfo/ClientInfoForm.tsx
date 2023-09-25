import * as React from 'react';
import { clientInfo as model } from 'models';
import { FormProviderWrapper } from '@fmg/ui/src/providers/FormProviderWrapper';
import { Button, CheckboxGroupWidget, RadioGroupWidget, Scope, TextareaWidget, TextInputWidget, useSnackbar } from '@fmg/ui';

export function ClientInfoForm() {
  const accountTypes = [
    { id: 'person', label: 'Person', value: 'person' },
    { id: 'collective', label: 'Collective', value: 'col' },
    { id: 'trust', label: 'Trust', value: 'trust' },
    { id: 'partnership', label: 'Partnership', value: 'partnership' },
    { id: 'trader', label: 'Trader', value: 'trader' },
    { id: 'ltd', label: 'Limited Company', value: 'ltd' },
    { id: 'other', label: 'Other', value: 'other' },
  ];

  const statementDeliveryOptions = [
    { id: 'post', label: 'Post', value: 'post' },
    { id: 'email', label: 'Email', value: 'email' },
    { id: 'declined', label: 'Declined', value: 'declined' },
  ];

  const { open, Container } = useSnackbar('success', 'Success');

  const onSubmit = () => {
    open();
  };

  return (
    <>
      <Container />
      <FormProviderWrapper model={model} uid={1} onSubmit={onSubmit} shouldResetForm mode="all">
        <Scope highlight>
          <Scope.Source>
            <RadioGroupWidget name="accountType" question="Account type" options={accountTypes} cols={3} size={10} required />
          </Scope.Source>
          <Scope.Target condition="other">
            <TextareaWidget name="accountTypeOther" question="Please specify account type" size={12} />
          </Scope.Target>
        </Scope>
        <TextInputWidget name="accountName" question="Account Name/Company Legal Name" ariaLabel="label" size={10} required />
        <TextInputWidget name="mailName" question="Mail name" size={9} placeholder="Add Mail Name if different from Account Name" />
        <TextareaWidget name="associatedEntities" question="Associated entities, Clients or Group" size={12} rows={4} />
        <TextInputWidget name="accountOwner" question="Account Owner" size={6} required />
        <TextInputWidget name="ownerEmailAddress" question="Owner Email Address" size={9} required />
        <CheckboxGroupWidget name="statementDelivery" question="Statement delivery" options={statementDeliveryOptions} required />
        <RadioGroupWidget name="willRegister" question="Register for FMG Connect" required />
        <TextInputWidget name="industryType" question="Industry type" size={12} placeholder="Primary source of income" required />
        <TextareaWidget
          name="otherActivities"
          question="What other income generating activities are you involved in?"
          size={12}
          rows={6}
          placeholder="For example: Beekeeping, Forestry, Orchard Fruit, etc..."
        />
        <div className="ml-[550px]">
          <div>
            <Button aria-label="label" color="primary">
              Submit
            </Button>
          </div>
        </div>
      </FormProviderWrapper>
    </>
  );
}
