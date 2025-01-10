import { PeriodUnit, toPeriodUnit } from "./PeriodUnit.type";
import { PositiveInteger, toPositiveInteger } from "./PositiveInteger.type";
import { timezoneDate } from "../utils/Date.utils";

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
  const lastEvent = timezoneDate(`${data.lastEvent}T23:59:59.999`)
  if (lastEvent.toString() === 'Invalid Date') throw new Error(`Invalid date format: ${data.lastEvent}`)
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