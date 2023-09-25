export function ternary<B, T, U>(truthy: B, ifTrue: T, ifFalse: U) {
  return truthy ? ifTrue : ifFalse;
}
