import { PeriodUnit, toPeriodUnit } from "./PeriodUnit";
import { PositiveInteger, toPositiveInteger } from "./PositiveInteger";
import { toDateString } from "./DateString";
import { createTimezoneDate, format } from "../utils/date/date.utils";
import { toTimeString } from "./TimeString";
import { TimezoneString } from "./TimezoneString";

export type Recurrency = {
  id?: string,
  title: string,
  lastEvent: Date,
  periodNb: PositiveInteger,
  periodUnit: PeriodUnit
}

export function toRecurrency(data: RecurrencyData, timezone: TimezoneString, id?: string): Recurrency {
  const dateString = toDateString(data.lastEvent)
  const timeString = toTimeString('23:59:59.999')
  const lastEvent = createTimezoneDate({dateString, timeString, timezone})

  const title = data.title
  const periodNb = toPositiveInteger(data.periodNb)
  const periodUnit = toPeriodUnit(data.periodUnit)

  return {
    id,
    title,
    lastEvent,
    periodNb,
    periodUnit
  }
}



export type RecurrencyData = {
  title: string,
  lastEvent: string,
  periodNb: number,
  periodUnit: string
}

export function toRecurrencyData(recurrency: Recurrency, timezone: TimezoneString): RecurrencyData {
  const { title, lastEvent, periodNb, periodUnit } = recurrency

  return {
    title,
    lastEvent: format(lastEvent, 'YYYY-MM-DD', timezone),
    periodNb,
    periodUnit
  }
}