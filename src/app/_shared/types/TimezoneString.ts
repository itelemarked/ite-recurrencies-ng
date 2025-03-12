
// List of supported timezones
// const TIMEZONES = {
//   Mauritius: 'Indian/Mauritius',
//   UTC: 'UTC',
//   Zurich: 'Europe/Zurich',
// }

// export type TimezoneString = keyof typeof TIMEZONES

const timezones = [
  'Indian/Mauritius',
  'UTC',
  'Europe/Zurich',
] as const

export type TimezoneString = typeof timezones[number]

export function toTimezoneString(val: string): TimezoneString {
  if(!timezones.includes(val as TimezoneString)) throw new Error(`Custom Type Error: "${val}" cannot be converted into TimezoneString...`)
  return val as TimezoneString
}




