import { DateFormat } from "../../types/DateFormat"
import { DateString } from "../../types/DateString"
import { Integer } from "../../types/Integer"
import { PeriodUnit } from "../../types/PeriodUnit"
import { TimeString } from "../../types/TimeString"
import { TimezoneString } from "../../types/TimezoneString"


export interface IDateUtils {
  createTimezoneDate({ dateString, timeString , timezone }: { dateString: DateString, timeString?: TimeString, timezone?: TimezoneString }): Date
  
  add(date: Date, nb: Integer, unit: PeriodUnit): Date
  
  endOf(date: Date, unit: PeriodUnit, timezone: TimezoneString): Date
  
  format(date: Date, format: DateFormat, timezone: TimezoneString): string
}

