
export enum Timezone {
  PLATFORM_DEFINED = 'platform-defined',
  INDIAN_MAURITIUS = 'Indian/Mauritius',
  EUROPE_ZURICH = 'Europe/Zurich',
  UTC = 'utc'
}

export function isTimezone(val: any): val is Timezone {
  try {
    return Object.values(Timezone).includes(val as Timezone);
  } catch {
    return false
  }
}