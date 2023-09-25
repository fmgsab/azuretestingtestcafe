import React, { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';

import { db, dd, roles, contact } from 'models';
import { DropdownWidget, RowKeyType } from '@fmg/ui';

export function MainDriver() {
  const { getValues } = useFormContext();
  const source = ['itemType', 'itemSubtype', 'usage', 'coverType'];
  const fieldValues = getValues(source);

  const hasRider = dd.has('rider')(fieldValues);
  const hasDriver = dd.has('driver')(fieldValues);

  const question = hasRider ? 'Main Rider' : 'Main Driver';

  const options = useExtractDrivers();

  return (
    <DropdownWidget
      name="mainDriver"
      question={question}
      options={options}
      required={true}
      scope={{ source, condition: hasRider || hasDriver }}
      size={5}
    />
  );
}

export function useExtractDrivers() {
  const [options, setOptions] = useState<{ value: string; label: string }[]>();

  useEffect(() => {
    getContactList().then((result = []) => {
      setOptions(result?.filter((contact) => contact?.roles?.includes(roles.driver)).map(displayDriver));
    });
  }, []);

  return options;
}

export function displayDriver(row: Pick<contact.FormValues, 'firstName' | 'lastName'> & { id: RowKeyType }) {
  const { id, firstName, lastName } = row;
  return { value: `${id}`, label: `${firstName} ${lastName}` };
}

export async function getContactList() {
  const table = db.tables.find((t) => t.name === 'contact');
  return table?.toArray();
}
