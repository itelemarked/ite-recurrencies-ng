import { TimezoneString, toTimezoneString } from "./TimezoneString";

export type SettingsData = {
  timezone?: string,
}

export type Settings = {
  timezone: TimezoneString,
}

export function toSettings(defaultSettings: Settings, data?: SettingsData): Settings {
  const _data = { ...defaultSettings, ...data }
  return {
    timezone: toTimezoneString(_data.timezone)
  }
}