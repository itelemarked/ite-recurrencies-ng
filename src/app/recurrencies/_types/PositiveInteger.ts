export type PositiveInteger = number & {_type: 'PositiveInteger'}

// export function toPositiveInteger(val: number): PositiveInteger {
//   const isPositive = val > 0;
//   const isInteger = Number.isInteger(val)

//   if(!isPositive || !isInteger) throw new Error(`Custom Type Error: "${val}" cannot be converted into PositiveInteger...`)
//   return val as PositiveInteger
// }

export function isPositiveInteger(val: any): val is PositiveInteger {
  const isPositive = val > 0;
  const isInteger = Number.isInteger(val)

  return isPositive && isInteger
}