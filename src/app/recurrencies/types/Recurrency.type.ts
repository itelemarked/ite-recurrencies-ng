import { isBoolean, isInterface, isNumber, isString } from "../../../js/valid-type"
import { DateString, isDateString } from "../../../js/timezone-date/types/DateString.type"
import { isPeriodUnit, PeriodUnit } from "../../../js/timezone-date/types/PeriodUnit.type"
import { isPositiveInteger, PositiveInteger } from "./PositiveInteger.type"
import { isTimezoneDate, TimezoneDate } from "src/js/timezone-date/TimezoneDate"
import { SHORT_BEFORE_MIDNIGHT } from "src/js/timezone-date/const/const"
import { Timezone } from "src/js/timezone-date/types/Timezone"
import { DATE_FORMAT } from "src/js/timezone-date/types/DateFormat"


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


export class Recurrency {

  uid: string
  title: string
  lastEvent: TimezoneDate
  periodNb: PositiveInteger
  periodUnit: PeriodUnit
  category: string

  constructor(uid: string, data: RecurrencyData, timezone: Timezone) {
    this.uid = uid
    this.title = data.title
    this.lastEvent = TimezoneDate.create(data.lastEvent, SHORT_BEFORE_MIDNIGHT, timezone)
    this.periodNb = data.periodNb
    this.periodUnit = data.periodUnit
    this.category = data.category
  }

  expiry(): TimezoneDate {
    return this.lastEvent.add(this.periodNb, this.periodUnit)
  }

  toData(): RecurrencyData {
    return {
      title: this.title,
      lastEvent: this.lastEvent.format(DATE_FORMAT.DATE_STRING) as DateString,
      periodNb: this.periodNb,
      periodUnit: this.periodUnit,
      category: this.category
    }
  }

}


export function isRecurrency(val: any): val is Recurrency {
  return val instanceof Recurrency
}







// export type Recurrency = {
//   uid: string,
//   title: string,
//   lastEvent: TimezoneDate,
//   periodNb: PositiveInteger,
//   periodUnit: PeriodUnit,
//   category: string
// }

// export function isRecurrency(val: any): val is Recurrency {
//   return isInterface({
//     uid: [isString],
//     title: [isString],
//     lastEvent: [isTimezoneDate],
//     periodNb: [isPositiveInteger],
//     periodUnit: [isPeriodUnit],
//     category: [isString]
//   })(val)
// }