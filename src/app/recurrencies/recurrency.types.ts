import { Signal } from "@angular/core"
import { Observable } from "rxjs"
import { DateString, isDateString, isPeriodUnit, isPositiveInteger, PeriodUnit, PositiveInteger } from "@app/_utils/date/date.types"


/** Data */
export type Data<T> = {
  uid: string
} & T


/** Recurrency */
export type Recurrency = {
  title: string,
  lastEvent: DateString,
  periodNb: PositiveInteger,
  periodUnit: PeriodUnit
}

export function isRecurrency(val: any): val is Recurrency {
  if (
    'title' in val &&
    typeof val['title'] === 'string' &&
    'lastEvent' in val &&
    isDateString(val['lastEvent']) &&
    'periodNb' in val &&
    isPositiveInteger(val['periodNb']) &&
    'periodUnit' in val &&
    isPeriodUnit(val['periodUnit'])
  ) {
    return true
  }
  return false
}


/** RecurrencyService */
export interface RecurrencyService {
  get$: () => Observable<Data<Recurrency>[]>
  get: () => Signal<Data<Recurrency>[]>
  add: (recurrency: Recurrency) => Promise<string>
  delete: (uid: string) => Promise<void>
  update: (uid: string, opts: Partial<Recurrency>) => Promise<void>
}