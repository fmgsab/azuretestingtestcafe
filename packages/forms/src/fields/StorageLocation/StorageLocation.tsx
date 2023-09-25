import * as React from 'react';
import { Options, OptionsProps } from '../shared/Options/Options';

export function StorageLocation(props: OptionsProps) {
  return (
    <Options
      as="list"
      name="storage"
      question="Storage Location"
      required="deferred"
      lookupKey="storages"
      hideIfEmpty
      size={5}
      {...props}
    />
  );
}
