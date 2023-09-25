export function toNumber(value: string | unknown): number {
  if (typeof value === 'number') return value;

  if (typeof value === 'string') {
    const number = Number(value.replace(/[$,]/g, ''));
    return isNaN(number) ? 0 : number;
  }
  return 0;
}
