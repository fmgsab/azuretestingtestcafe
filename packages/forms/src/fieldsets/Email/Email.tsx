import { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { asEmail } from 'models/src/schemas/schema';
import { Checkbox, MultiInputWidget, TextInput, useSaveField } from '@fmg/ui';

export function Email() {
  const saveField = useSaveField();
  const { getValues } = useFormContext();
  const { address, notProvided, declined, noEmail } = getValues('email') ?? {};

  const disableAddress = [notProvided, declined, noEmail].some((val) => val === true);
  const disableReasons = Boolean(asEmail().safeParse(address).success) || disableAddress;

  // the required error remains if the value is undefined or null
  useEffect(() => {
    if (disableAddress) {
      saveField({ name: 'email.address', value: '' });
    }
  }, [saveField, disableAddress]);

  return (
    <MultiInputWidget name="email" question="Email" sizes={[10, 4, 4, 4]}>
      <TextInput name="address" label="Email" disabled={disableAddress} deferValidation />
      <Checkbox name="notProvided" label="Not yet provided" saveOnChange required={false} disabled={disableReasons && !notProvided} />
      <Checkbox name="noEmail" label="No email" saveOnChange required={false} disabled={disableReasons && !noEmail} />
      <Checkbox name="declined" label="Declined to provide" saveOnChange required={false} disabled={disableReasons && !declined} />
    </MultiInputWidget>
  );
}
