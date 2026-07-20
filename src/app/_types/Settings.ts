
import { DateFormat, isDateFormat } from "../../js/timezone-date/types/DateFormat"
import { isTimezone, Timezone } from "../../js/timezone-date/types/Timezone"
import { isInterface } from "../../js/types/valid-type"



export type Settings = {
  timezone: Timezone,
  dateFormat: DateFormat
}

export function isSettings(val: any): val is Settings {
  return isInterface<Settings>({
    timezone: [isTimezone],
    dateFormat: [isDateFormat]
  })(val)
}