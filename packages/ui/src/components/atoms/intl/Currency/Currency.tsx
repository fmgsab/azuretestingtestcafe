type CurrencyProps = {
  value: bigint | boolean | number | string;
  className?: string;
  fallback?: string;
  minimumIntegerDigits?: number;
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
  minimumSignificantDigits?: number;
  maximumSignificantDigits?: number;
};

export function Currency({ value, className, fallback = '', ...intlProps }: CurrencyProps) {
  const convertToNumber = (str: string | unknown) => {
    return typeof str === 'string' ? parseFloat(str.replaceAll(/,/g, '')) : Number(str);
  };
  const number = convertToNumber(value);

  return (
    <span className={className}>
      {number
        ? new Intl.NumberFormat('en-NZ', {
            style: 'currency',
            currency: 'NZD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
            // eslint-disable-next-line
            // @ts-ignore
            trailingZeroDisplay: 'stripIfInteger',
            ...intlProps,
          }).format(number)
        : fallback}
    </span>
  );
}
