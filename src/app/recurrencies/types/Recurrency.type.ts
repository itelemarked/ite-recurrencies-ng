import { isBoolean, isInterface, isNumber, isString } from "../../../js/valid-type"
import { DateString, isDateString } from "../../../js/timezone-date/types/DateString.type"
import { isPeriodUnit, PeriodUnit } from "../../../js/timezone-date/types/PeriodUnit.type"
import { isPositiveInteger, PositiveInteger } from "./PositiveInteger.type"
import { isTimezoneDate, TimezoneDate } from "src/js/timezone-date/TimezoneDate"

export type Recurrency = {
  uid: string,
  title: string,
  lastEvent: TimezoneDate,
  periodNb: PositiveInteger,
  periodUnit: PeriodUnit,
  category: string
}

// TODO: Change lastEvent in isTimezoneDate iso isDateString!!!
// export function isRecurrency(val: any): val is Recurrency {
//   return isInterface({
//     uid: [isString],
//     title: [isString],
//     lastEvent: [isDateString],
//     periodNb: [isPositiveInteger],
//     periodUnit: [isPeriodUnit],
//     category: [isString]
//   })(val)
// }

export function isRecurrency(val: any): val is Recurrency {
  return isInterface({
    uid: [isString],
    title: [isString],
    lastEvent: [isTimezoneDate],
    periodNb: [isPositiveInteger],
    periodUnit: [isPeriodUnit],
    category: [isString]
  })(val)
}