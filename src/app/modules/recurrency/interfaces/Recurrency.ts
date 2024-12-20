import { tzDate } from "@formkit/tempo";
import { DateString, toDateString } from "./DateString";
import { PeriodUnit, toPeriodUnit } from "./PeriodUnit";
import { PositiveInteger, toPositiveInteger } from "./PositiveInteger";
import { RecurrencyData } from "./RecurrencyData";
import { timezoneDate } from "../utils/utils-date";

export interface Recurrency {
  title: string,
  lastEvent: Date,
  periodNb: PositiveInteger,
  periodUnit: PeriodUnit
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