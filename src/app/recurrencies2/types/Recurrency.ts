
import { DateString } from "../../../js/timezone-date/types/DateString"
import { PeriodUnit } from "../../../js/timezone-date/types/PeriodUnit"
import { TimezoneDate } from "../../../js/timezone-date/TimezoneDate"
import { SHORT_BEFORE_MIDNIGHT } from "../../../js/timezone-date/const/const"
import { Timezone } from "../../../js/timezone-date/types/Timezone"
import { DATE_FORMAT } from "../../../js/timezone-date/types/DateFormat"

import { PositiveInteger } from "./PositiveInteger"
import { RecurrencyData } from "./RecurrencyData"


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

  // clone(): Recurrency {
  //   return new Recurrency(this.uid, this.toData(), this.)
  // }

}


export function isRecurrency(val: any): val is Recurrency {
  return val instanceof Recurrency
}
