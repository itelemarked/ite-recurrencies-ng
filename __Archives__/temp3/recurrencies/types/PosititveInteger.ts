export type PositiveInteger = number & { _type: 'PositiveInteger' }
 
export function isPositiveInteger(val: any): val is PositiveInteger {
  const isPositive = val > 0;
  const isInteger = Number.isInteger(val)

  return isPositive && isInteger
}