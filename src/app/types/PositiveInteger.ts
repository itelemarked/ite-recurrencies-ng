
export type PositiveInteger = number & {_type: 'PositiveInteger'}

export function isPositiveInteger(val: unknown): val is PositiveInteger {
  const isNumber = (v: unknown): v is number => typeof v === 'number'
  const isPositive = (v: number) => v > 0;
  const isInteger = (v: number) => Number.isInteger(v)

  return isNumber(val) && isPositive(val) && isInteger(val)
}

export function toPositiveInteger(val: number): PositiveInteger {
  const isPositive = val > 0;
  const isInteger = Number.isInteger(val)

  if(!isPositive || !isInteger) throw new Error(`Custom Type Error: "${val}" cannot be converted into PositiveInteger...`)
  return val as PositiveInteger
}