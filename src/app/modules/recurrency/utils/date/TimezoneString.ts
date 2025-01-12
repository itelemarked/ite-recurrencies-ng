import { DAYJS } from "./_dayjs"


export type TimezoneString = string & {_type: 'TimezoneString'}

export function toTimezoneString(val: string): TimezoneString {
  try {
    DAYJS().tz(val)
    return val as TimezoneString
  }
  catch {
    throw new Error(`Custom Type Error: "${val}" is not a valid IANA TIMEZONE...`)
  }
}