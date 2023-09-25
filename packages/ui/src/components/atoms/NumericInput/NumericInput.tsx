import { forwardRef } from 'react';
import { AffixInput, AffixInputProps } from '../AffixInput/AffixInput';

export type NumericInputProps = Omit<AffixInputProps, 'isNumeric' | 'prefix'> &
  (
    | {
        isSumInsured: true;
        isCurrency?: never;
      }
    | {
        isCurrency: true;
        isSumInsured?: never;
      }
    | {
        isCurrency?: never;
        isSumInsured?: never;
        prefix?: AffixInputProps['prefix'];
      }
  );

export const NumericInput = forwardRef<HTMLInputElement, NumericInputProps>(function CustomInput(props: NumericInputProps) {
  const { isSumInsured, isCurrency, allowLeadingZeros = false, decimalScale = 0, showErrorIcon = false, ...rest } = props;
  const prefix = isSumInsured || isCurrency ? '$' : props.prefix;
  const placeholder = isSumInsured ? props.placeholder ?? 'Sum Insured' : props.placeholder;

  return (
    <AffixInput
      {...rest}
      isNumeric
      prefix={prefix}
      placeholder={placeholder}
      allowLeadingZeros={allowLeadingZeros}
      decimalScale={decimalScale}
      showErrorIcon={showErrorIcon}
    />
  );
});
