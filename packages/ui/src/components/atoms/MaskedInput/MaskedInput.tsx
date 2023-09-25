import React from 'react';
import { InputMask, InputMaskProps } from '@react-input/mask';
import TextInput from '../TextInput/TextInput';
import { PhoneTypeProps, TextInputProps } from '../../../types';
import { useFormContext } from 'react-hook-form';

function getMask(type: string): string {
  switch (type) {
    case 'Work':
      return '##-###-#### x#####';
    case 'Home':
      return '##-###-####';
    case 'Mobile':
      return '###-###-#####';
    default:
      return '##-###-####';
  }
}

// eslint-disable-next-line react/display-name
export const MaskedInput = React.forwardRef(({ phoneType, ...props }: TextInputProps & InputMaskProps & PhoneTypeProps, ref) => {
  const { watch } = useFormContext() ?? {};
  let type = '';
  if (!phoneType) {
    type = watch ? watch('phone').type : '';
  } else {
    type = phoneType;
  }
  return <InputMask component={TextInput} mask={getMask(type)} replacement={{ '#': /\d/ }} {...props} />;
});
