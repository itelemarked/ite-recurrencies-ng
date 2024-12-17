import { DateString, toDateString } from "./DateString";
import { PeriodUnit, toPeriodUnit } from "./PeriodUnit";
import { PositiveInteger, toPositiveInteger } from "./PositiveInteger";
import { RecurrencyData } from "./RecurrencyData";

export interface Recurrency {
  title: string,
  lastEvent: Date,
  periodNb: PositiveInteger,
  periodUnit: PeriodUnit
}

export function toRecurrency(data: RecurrencyData): Recurrency {
  const title = data.title
  const lastEvent = new Date(`${data.lastEvent}T23:59:59.999`)
  const periodNb = toPositiveInteger(data.periodNb)
  const periodUnit = toPeriodUnit(data.periodUnit)

  return {
    title,
    lastEvent,
    periodNb,
    periodUnit
  }
}