import React from 'react';

import { Options, OptionsProps } from '../shared/Options/Options';

export function CoverType({ as = 'radio', ...props }: OptionsProps) {
  return <Options as={as} name="coverType" question="Cover type" required lookupKey="coverTypes" hideIfEmpty cols={3} {...props} />;
}
