
export type PositiveInteger = number & {_type: 'PositiveInteger'}

export function toPositiveInteger(val: number): PositiveInteger {
  const isPositive = val > 0;
  const isInteger = Number.isInteger(val)

  if(!isPositive || !isInteger) throw new Error(`Custom Type Error: "${val}" cannot be converted into PositiveInteger...`)
  return val as PositiveInteger
}