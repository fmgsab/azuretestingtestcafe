import React, { useState } from 'react';
import { house as model } from 'models';
import { AppendableList, Button, FormProviderWrapper, RadioGroupWidget, TextInputWidget, useSnackbar } from '@fmg/ui';
import { dd } from 'models/src/data-dictionary/data-dictionary';

export function DwellingInfoForm() {
  const [isRequesting, setIsRequesting] = useState(false);

  const { open, Container } = useSnackbar('success', 'Success');
  // Example POST method implementation:
  function onSubmit(data: model.FormValues) {
    setIsRequesting(true);
    fetch('/api/submit', {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      mode: 'cors', // no-cors, *cors, same-origin
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'same-origin', // include, *same-origin, omit
      headers: {
        'Content-Type': 'application/json',
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      redirect: 'follow', // manual, *follow, error
      referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      body: JSON.stringify(data), // body data type must match "Content-Type" header
    }).then((res) => {
      setIsRequesting(false);
      open();
      return res.json();
    });
  }

  const coverTypes = [
    { label: 'RCSI', value: 'capped' },
    { label: 'NRV', value: 'nrv' },
    { label: 'PDV', value: 'pdv' },
  ];

  const volExcesses = [
    { label: '$500', value: 500 },
    { label: '$1,000', value: 1000 },
    { label: '$2,000', value: 2000 },
    { label: '$5,000', value: 5000 },
    { label: '$10,000', value: 10000 },
  ];

  const occupancies = [
    { label: 'Owner/Family', value: 'owner' },
    { label: 'Tenanted', value: 'tenanted' },
    { label: 'Employee', value: 'employee' },
    { label: 'Unoccupied', value: 'unoccupied' },
    { label: 'Holiday Home', value: 'holiday' },
  ];

  console.log(dd.data);

  return (
    <>
      <Container />
      <FormProviderWrapper model={model} uid={1} onSubmit={onSubmit} defaultValues={{ intParties: [{ intParty: '' }] }} mode="onTouched">
        <TextInputWidget name="itemDesc" question="Item description" size={10} required />
        <TextInputWidget name="situationOfRisk" question="Situation of risk" size={4} placeholder="#" required />
        <RadioGroupWidget name="cover" question="Cover" options={coverTypes} required />
        <TextInputWidget name="sumInsured" question="Sum insured" size={4} placeholder="$" required />
        <RadioGroupWidget name="volExcess" question="Voluntary excess" options={volExcesses} required />
        <AppendableList question="Interest party" addButtonLabel="Add Interest Party" name="intParties" required>
          <TextInputWidget name="intParty" size={8} />
        </AppendableList>
        <RadioGroupWidget name="occupancy" question="Occupancy" options={occupancies} cols={3} required />
        <RadioGroupWidget name="hasShortTermGuest" question="Short term paying guests" />
        <RadioGroupWidget name="isMortgageSale" question="Mortgage sale" />
        {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
        {/*// @ts-ignore*/}
        <Button type="submit" loading={isRequesting} className="col-span-2 m-10" aria-label="submit" color="primary">
          {isRequesting ? 'Saving..' : 'Save'}
        </Button>
      </FormProviderWrapper>
    </>
  );
}
