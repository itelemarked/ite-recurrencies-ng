import { PeriodUnit } from "../_types/PeriodUnit"
import { PositiveInteger } from "../_types/PositiveInteger"
import { IDatum } from "./IDatum"


export interface IRecurrencyData {
  title: string,
  lastEvent: string,
  periodNb: number,
  periodUnit: string,
  id?: string
}


export interface IRecurrencyOptions {
  offset?: string
}

export interface IRecurrency {
  id(): string,
  title(): string,
  lastEvent(): IDatum,
  periodNb(): PositiveInteger,
  periodUnit(): PeriodUnit,
  expiry(): IDatum,
  progress(): number,
  remainingPeriod(unit: PeriodUnit): number,
  setTitle(val: string): IRecurrency,
  setLastEvent(val: string): IRecurrency,
  setPeriodNb(val: number, master: 'lastEvent' | 'expiry'): IRecurrency,
  setPeriodUnit(val: string, master: 'lastEvent' | 'expiry'): IRecurrency,
  setExpiry(val: string, master: 'lastEvent' | 'period'): IRecurrency
}