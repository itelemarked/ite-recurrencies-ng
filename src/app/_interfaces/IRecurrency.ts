import { DateString, toDateString } from "../_types/DateString"
import { PeriodUnit, toPeriodUnit } from "../_types/PeriodUnit"
import { PositiveInteger, toPositiveInteger } from "../_types/PositiveInteger"
import { IDatum } from "./IDatum"


export interface IRecurrency {
  id?: string,
  title: string,
  lastEvent: DateString,
  periodNb: PositiveInteger,
  periodUnit: PeriodUnit
}

export interface IRecurrencyData {
  title: string,
  lastEvent: string,
  periodNb: number,
  periodUnit: string
}

export function toRecurrency(data: IRecurrencyData & {id?: string}): IRecurrency {
  const { lastEvent, periodNb, periodUnit } = data
  try {
    toDateString(lastEvent)
    toPositiveInteger(periodNb)
    toPeriodUnit(periodUnit)
  }
  catch(err: any) {
    throw new Error(`Error: Custom type error, toRecurrency()... ${err}`, { cause: 'toRecurrency()' })
  }
  return data as IRecurrency
}