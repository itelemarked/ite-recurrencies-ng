import { DateString, isDateString } from "../../../js/timezone-date/types/DateString.type"
import { isPeriodUnit, PeriodUnit } from "../../../js/timezone-date/types/PeriodUnit.type"
import { isInterface, isOptional, isString, isUndefined } from "../../../js/valid-type"
import { isPositiveInteger, PositiveInteger } from "../../recurrencies/types/PositiveInteger.type"

export type Recurrency = {
  uid: string | undefined,
  title: string,
  lastEvent: DateString,
  periodNb: PositiveInteger,
  periodUnit: PeriodUnit,
  category: string
}

export function isRecurrency(val: any): val is Recurrency {
  return isInterface({
    uid: [isString, isUndefined],
    title: [isString],
    lastEvent: [isDateString],
    periodNb: [isPositiveInteger],
    periodUnit: [isPeriodUnit],
    category: [isString]
  })(val)
}