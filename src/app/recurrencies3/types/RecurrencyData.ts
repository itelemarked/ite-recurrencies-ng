import { DateString, isDateString } from "../../../js/timezone-date/types/DateString"
import { isPeriodUnit, PeriodUnit } from "../../../js/timezone-date/types/PeriodUnit"
import { isPositiveInteger, PositiveInteger } from "../../../js/timezone-date/types/PositiveInteger"
import { isInterface, isString } from "../../../js/valid-type"

export type RecurrencyData = {
  title: string,
  lastEventString: DateString,
  periodNb: PositiveInteger,
  periodUnit: PeriodUnit,
  category: string
}

export function isRecurrencyData(val: any): val is RecurrencyData {
  return isInterface({
    title: [isString],
    lastEventString: [isDateString],
    periodNb: [isPositiveInteger],
    periodUnit: [isPeriodUnit],
    category: [isString]
  })(val)
}