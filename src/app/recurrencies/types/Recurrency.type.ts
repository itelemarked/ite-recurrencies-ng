import { isBoolean, isInterface, isNumber, isString } from "../utils/valid-type"
import { DateString, isDateString } from "./DateString.type"
import { isPeriodUnit, PeriodUnit } from "./PeriodUnit.type"
import { isPositiveInteger, PositiveInteger } from "./PositiveInteger.type"

export type Recurrency = {
  uid: string,
  title: string,
  lastEvent: DateString,
  periodNb: PositiveInteger,
  periodUnit: PeriodUnit,
  category: string
}

export function isRecurrency(val: any): val is Recurrency {
  return isInterface({
    uid: [isString],
    title: [isString],
    lastEvent: [isDateString],
    periodNb: [isPositiveInteger],
    periodUnit: [isPeriodUnit],
    category: [isString]
  })(val)
}