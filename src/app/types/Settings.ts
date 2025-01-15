import { TimezoneString, toTimezoneString } from "./TimezoneString";

const DEFAULT_SETTINGS: Settings = {
  timezone: 'Europe/Zurich'
}

export type SettingsData = {
  timezone?: string,
}

export type Settings = {
  timezone: TimezoneString,
}

export function toSettings(data?: SettingsData): Settings {
  const _data = { data, ...DEFAULT_SETTINGS }
  return {
    timezone: toTimezoneString(_data.timezone)
  }
}