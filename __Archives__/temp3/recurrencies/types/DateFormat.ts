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