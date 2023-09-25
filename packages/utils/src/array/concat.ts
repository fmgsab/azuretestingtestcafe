export function concat(arr: (string | null | undefined)[], delimiter = ', '): string {
  return arr.filter(Boolean).join(delimiter);
}
