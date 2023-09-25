export function checkSizeIfSet(val: unknown) {
  // console.log(val instanceof Set, { val });
  return !(val instanceof Set) || val.size > 0;
}
