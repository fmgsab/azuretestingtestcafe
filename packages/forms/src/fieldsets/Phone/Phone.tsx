import React from 'react';
import { Dropdown, MaskedInput, MultiInputWidget } from '@fmg/ui';
import { dd } from 'models/src/data-dictionary/data-dictionary';

type PhoneProps = {
  question: string;
  sizes?: number[];
};

export function Phone({ question, sizes = [4, 6] }: PhoneProps) {
  return (
    <MultiInputWidget name="" question={question} sizes={sizes} required={true}>
      <Dropdown size={sizes[0]} name="phone.type" label="Phone type" options={dd.get('phoneTypes')()} />
      <MaskedInput size={sizes[1]} name="phone.number" label="Phone number" />
    </MultiInputWidget>
  );
}
