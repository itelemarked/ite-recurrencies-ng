import { DateString, isDateString } from "../../../js/timezone-date/types/DateString"
import { isPeriodUnit, PeriodUnit } from "../../../js/timezone-date/types/PeriodUnit"
import { isInterface, isString } from "../../../js/valid-type"

import { isPositiveInteger, PositiveInteger } from "./PositiveInteger"

export type RecurrencyData = {
  title: string,
  lastEvent: DateString,
  periodNb: PositiveInteger,
  periodUnit: PeriodUnit,
  category: string
}


export function isRecurrencyData(val: any): val is RecurrencyData {
  return isInterface({
    title: [isString],
    lastEvent: [isDateString],
    periodNb: [isPositiveInteger],
    periodUnit: [isPeriodUnit],
    category: [isString]
  })(val)
}