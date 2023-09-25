import React from 'react';

import { Options, OptionsProps } from '../shared/Options/Options';

export function EngineType({ as = 'list', ...props }: OptionsProps) {
  return <Options as={as} name="engineType" question="Engine type" required lookupKey="engineTypes" hideIfEmpty size={5} {...props} />;
}
