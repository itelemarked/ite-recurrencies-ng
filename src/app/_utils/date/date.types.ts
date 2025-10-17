/********** DATE_FORMAT **********/
export const DATE_FORMAT = {
  PLATFORM_DEFINED: 'PLATFORM_DEFINED',
  CH: 'CH',
  US: 'US',
  ISO: 'ISO'
 } as const

export type DateFormat = typeof DATE_FORMAT[keyof typeof DATE_FORMAT]

export function isDateFormat(val: any): val is DateFormat {
  return Object.values(DATE_FORMAT).includes(val)
}


/********** TIMEZONE **********/
/**
 * Maps to Iana Timezones
 */

export const TIMEZONE = {
  PLATFORM_DEFINED: 'platform-defined',
  MAURITIUS: 'Indian/Mauritius',
  ZURICH: 'Europe/Zurich'
} as const

export type Timezone = typeof TIMEZONE[keyof typeof TIMEZONE]

export function isTimezone(val: any): val is Timezone {
  return Object.values(TIMEZONE).includes(val)
}


/********** PERIOD_UNIT **********/
/**
 * Maps to dayjs period units
 */
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

/********** DATE_STRING **********/
export type DateString = string & {_type: 'DateString'}

export function isDateString(val: any): val is DateString {
  const isDateStringRegex = /^\d{4}-\d{2}-\d{2}$/.test(val)
  const isValidDate = new Date(val).toString() !== 'Invalid Date'

  return isDateStringRegex && isValidDate
}


/********** POSITIVE_INTEGER **********/
export type PositiveInteger = number & {_type: 'PositiveInteger'}

export function isPositiveInteger(val: any): val is PositiveInteger {
  const isPositive = val > 0;
  const isInteger = Number.isInteger(val)

  return isPositive && isInteger
}


