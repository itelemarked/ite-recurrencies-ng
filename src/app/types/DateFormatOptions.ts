
const dateFormats = [
  'UTC', 
  'DD.MM.YYYY',
  'DD.MM.YY HH:mm:ss.SSS TIMEZONE'
] as const

export type DateFormatOptions = typeof dateFormats[number]

export function toDateFormat(val: string): DateFormatOptions {
  if(!dateFormats.includes(val as DateFormatOptions)) throw new Error(`Custom Type Error: "${val}" cannot be converted into DateFormat...`)
  return val as DateFormatOptions
}
