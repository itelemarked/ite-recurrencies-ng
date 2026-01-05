import { Signal } from "@angular/core"
import { Observable } from "rxjs"
import { DateString, isDateString, isPeriodUnit, isPositiveInteger, PeriodUnit, PositiveInteger, TimeString, Timezone } from "src/__Archives__/temp3/z-Archives/z_utils/date/date.types"
import { TimezoneDate } from "src/__Archives__/temp3/recurrencies/models/TimezoneDate"
import { isInterface, isString } from "src/__Archives__/temp3/recurrencies/utils/validation"


type RecurrencyData = {
  uid: string,
  title: string,
  lastEvent: DateString,
  periodNb: PositiveInteger,
  periodUnit: PeriodUnit,
}

function isRecurrencyData(val: any): val is RecurrencyData {
  const isRecurrencyData = isInterface({
    uid: [isString],
    title: [isString],
    lastEvent: [isDateString],
    periodNb: [isPositiveInteger],
    periodUnit: [isPeriodUnit]
  })

  return isRecurrencyData(val)
}

export type Recurrency = {
  uid: string,
  title: string,
  lastEventDate: TimezoneDate,
  periodNb: PositiveInteger,
  periodUnit: PeriodUnit,
  expiryDate: () => TimezoneDate,
  diffFromNow: () => number
}

export function toRecurrency(val: any, timezone: Timezone): Recurrency {
  if(!isRecurrencyData(val)) throw new Error(`Cannot convert 'val' into 'Recurrency'... ${val}`)
  
  const { uid, title, lastEvent, periodNb, periodUnit } = val
  const SHORT_BEFORE_MIDNIGHT_TIME = '23:59:59.999' as TimeString

  const lastEventDate = new TimezoneDate(lastEvent, SHORT_BEFORE_MIDNIGHT_TIME, timezone)
  const expiryDate = () => lastEventDate.add(periodNb, periodUnit)
  const diffFromNow = () => expiryDate().diffFromNow(periodUnit)

  return {
    uid,
    title,
    lastEventDate,
    periodNb,
    periodUnit,
    expiryDate,
    diffFromNow
  }
}