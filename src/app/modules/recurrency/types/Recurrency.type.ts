import { PeriodUnit, toPeriodUnit } from "./PeriodUnit.type";
import { PositiveInteger, toPositiveInteger } from "./PositiveInteger.type";
import { toDateString } from "../utils/date/DateString";
import { toTimeString } from "../utils/date/TimeString";
import { createTimezoneDate } from "../utils/date/date.utils";

export type Recurrency = {
  title: string,
  lastEvent: Date,
  periodNb: PositiveInteger,
  periodUnit: PeriodUnit
}

type RecurrencyData = {
  title: string,
  lastEvent: string,
  periodNb: number,
  periodUnit: string
}

export function toRecurrency(data: RecurrencyData): Recurrency {
  const dateString = toDateString(data.lastEvent)
  const timeString = toTimeString('23:59:59.999')
  const lastEvent = createTimezoneDate({dateString, timeString})

  const title = data.title
  const periodNb = toPositiveInteger(data.periodNb)
  const periodUnit = toPeriodUnit(data.periodUnit)

  return {
    title,
    lastEvent,
    periodNb,
    periodUnit
  }
}
