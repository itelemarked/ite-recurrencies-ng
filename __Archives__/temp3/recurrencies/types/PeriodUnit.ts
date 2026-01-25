export const PERIOD_UNIT = {
  MILLISECONDS: 'milliseconds',
  SECONDS: 'seconds',
  MINUTES: 'minutes',
  HOURS: 'hours',
  DAYS: 'days',
  WEEKS: 'weeks',
  MONTHS: 'months',
  YEARS: 'years'
 } as const

export type PeriodUnit = typeof PERIOD_UNIT[keyof typeof PERIOD_UNIT]

export function isPeriodUnit(val: any): val is PeriodUnit {
  return Object.values(PERIOD_UNIT).includes(val)
}