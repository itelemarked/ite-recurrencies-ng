export const TIMEZONES = ['Europe/Zurich', 'Indian/Mauritius'] as const;
export type Timezone = (typeof TIMEZONES)[number];

export const DATE_FORMAT = {
  PLATFORM_DEFINED: 'PLATFORM_DEFINED',
  CH_DATE: 'CH_DATE',
  CH_DATE_TIME: 'CH_DATE_TIME',
  US_DATE: 'US_DATE',
  ISO: 'ISO',
  DATE_STRING: 'DATE_STRING',
} as const;

export type DateFormat = (typeof DATE_FORMAT)[keyof typeof DATE_FORMAT];

export interface Settings {
  timezone: Timezone;
  dateFormat: DateFormat;
}

export const SETTINGS_UID = 'SETTINGS_UID';

export function isValidSettings(data: unknown): data is Settings {
  if (typeof data !== 'object' || data === null) return false;
  const candidate = data as Record<string, unknown>;

  return (
    typeof candidate['timezone'] === 'string' &&
    (TIMEZONES as readonly string[]).includes(candidate['timezone']) &&
    typeof candidate['dateFormat'] === 'string' &&
    (Object.values(DATE_FORMAT) as readonly string[]).includes(candidate['dateFormat'])
  );
}
