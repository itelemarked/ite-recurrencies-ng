import { DateFormat, isDateFormat } from "src/js/timezone-date/types/DateFormat"
import { isTimezone, Timezone } from "src/js/timezone-date/types/Timezone"
import { isInterface } from "src/js/valid-type"

export type Settings = {
  timezone: Timezone,
  dateFormat: DateFormat
}

export function isSettings(val: any): val is Settings {
  return isInterface<Settings>({
    timezone: [isTimezone],
    dateFomrat: [isDateFormat]
  })(val)
}