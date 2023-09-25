import { JSX, JSXElementConstructor } from 'react';
import { FieldProps } from '@fmg/ui/src/types/form-types';

type As = JSXElementConstructor | JSX.IntrinsicElements;

export type AbstractFieldProps = Partial<FieldProps> & {
  as?: As | 'list' | 'radio' | 'checkbox' | 'individual';
  hasDefault?: boolean;
  cols?: number; // for radio & checkbox groups
  isMulti?: boolean;
  lookupKey?: string;
  fields?: string[];
};
