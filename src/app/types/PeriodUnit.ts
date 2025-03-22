const periodUnits = [
  'milliseconds',
  'seconds',
  'minutes',
  'hours',
  'days',
  'weeks',
  'months',
  'years'
] as const

export type PeriodUnit = typeof periodUnits[number]

export function isPeriodUnit(val: unknown): val is PeriodUnit {
  const isString = (v: unknown): v is string => typeof v === 'string'
  return isString(val) && periodUnits.includes(val as PeriodUnit)
}

export function toPeriodUnit(val: string): PeriodUnit {
  if(!periodUnits.includes(val as PeriodUnit)) throw new Error(`Custom Type Error: "${val}" cannot be converted into PeriodUnit...`)
  return val as PeriodUnit
}