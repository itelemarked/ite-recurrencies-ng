import { isTimezoneDate, TimezoneDate } from "../../js/timezone-date/TimezoneDate"
import { isPeriodUnit, PeriodUnit } from "../../js/timezone-date/types/PeriodUnit"
import { isPositiveInteger, PositiveInteger } from "../../js/timezone-date/types/PositiveInteger"
import { isInterface, isString } from "../../js/types/valid-type"


export type Recurrency = {
  title: string,
  lastEvent: TimezoneDate,
  periodNb: PositiveInteger,
  periodUnit: PeriodUnit,
  category: string
}

export function isRecurrency(val: any): val is Recurrency {
  return isInterface({
    title: [isString],
    lastEvent: [isTimezoneDate],
    periodNb: [isPositiveInteger],
    periodUnit: [isPeriodUnit],
    category: [isString]
  })(val)
}