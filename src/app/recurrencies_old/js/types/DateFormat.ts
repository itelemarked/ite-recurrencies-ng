export const DATE_FORMAT = {
  PLATFORM_DEFINED: 'PLATFORM_DEFINED',
  CH_DATE: 'CH_DATE',
  CH_DATE_TIME: 'CH_DATE_TIME',
  US_DATE: 'US_DATE',
  ISO: 'ISO',
  DATE_STRING: 'DATE_STRING'
 } as const

export type DateFormat = typeof DATE_FORMAT[keyof typeof DATE_FORMAT]

export function isDateFormat(val: any): val is DateFormat {
  return Object.values(DATE_FORMAT).includes(val)
}