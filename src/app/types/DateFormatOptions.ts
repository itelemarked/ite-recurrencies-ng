
const dateFormats = [
  'UTC', 
  'DD.MM.YYYY',
  'DD.MM.YY HH:mm:ss.SSS TIMEZONE',
  'YYYY-MM-DD'
] as const

export type DateFormatOptions = typeof dateFormats[number]

export function toDateFormat(val: string): DateFormatOptions {
  if(!dateFormats.includes(val as DateFormatOptions)) throw new Error(`Custom Type Error: "${val}" cannot be converted into DateFormat...`)
  return val as DateFormatOptions
}





export enum DateFormat {
  CH = '31.12.2020',
  US = '12/31/2025',
  ISO = '2020-12-31',
  FULL = '31.12.25 13:59:59.999 TIMEZONE'
}
