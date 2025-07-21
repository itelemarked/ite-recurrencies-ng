
// List of supported timezones
// const TIMEZONES = {
//   Mauritius: 'Indian/Mauritius',
//   UTC: 'UTC',
//   Zurich: 'Europe/Zurich',
// }

// export type TimezoneString = keyof typeof TIMEZONES

const supportedTimezones = [
  'Indian/Mauritius',
  'UTC',
  'Europe/Zurich',
] as const

export type TimezoneString = typeof supportedTimezones[number]

export function toTimezoneString(val: string): TimezoneString {
  if(!supportedTimezones.includes(val as TimezoneString)) throw new Error(`Custom Type Error: "${val}" cannot be converted into TimezoneString...`)
  return val as TimezoneString
}



export enum Timezone {
  INDIAN_MAURITIUS = 'Indian/Mauritius',
  EUROPE_ZURICH = 'Europe/Zurich',
  UTC = 'UTC'
}
