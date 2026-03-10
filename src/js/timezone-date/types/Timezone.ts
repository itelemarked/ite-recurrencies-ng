export const TIMEZONE = {
  PLATFORM_DEFINED: 'platform-defined',
  MAURITIUS: 'Indian/Mauritius',
  ZURICH: 'Europe/Zurich',
  UTC: 'UTC'
} as const

export type Timezone = typeof TIMEZONE[keyof typeof TIMEZONE]

export function isTimezone(val: any): val is Timezone {
  return Object.values(TIMEZONE).includes(val)
}