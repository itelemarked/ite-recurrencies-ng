
const dateFormats = [
  'UTC', 
  'DD.MM.YYYY',
  'DD.MM.YY HH:mm:ss.SSS TIMEZONE'
] as const

export type DateFormat = typeof dateFormats[number]

export function toDateFormat(val: string): DateFormat {
  if(!dateFormats.includes(val as DateFormat)) throw new Error(`Custom Type Error: "${val}" cannot be converted into DateFormat...`)
  return val as DateFormat
}
