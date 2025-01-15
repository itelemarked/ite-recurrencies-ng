import { Injectable } from "@angular/core";
import { BehaviorSubject, delay, filter, map, Observable } from "rxjs";
import { Recurrency, RecurrencyData, toRecurrency, toRecurrencyData } from "../types/Recurrency";
import { TimezoneString } from "../types/TimezoneString";

let DATAS: Record<string, Record<string, any>> = {
  'aaaaaa': {
    title: 'MOCK-PU',
    lastEvent: '2024-12-10',
    periodNb: 132,
    periodUnit: 'days'
  },
  'bbbbbb': {
    title: 'MOCK-EC',
    lastEvent: '2024-12-11',
    periodNb: 66,
    periodUnit: 'days'
  },
  'cccccc': {
    title: 'MOCK-PC-6',
    lastEvent: '2024-12-09',
    periodNb: 188,
    periodUnit: 'days'
  },
  'dddddd': {
    title: 'MOCK-PC-7',
    lastEvent: '2024-12-09',
    periodNb: 94,
    periodUnit: 'days'
  },
}


@Injectable({providedIn: 'root'})
export class RecurrencyService {

  private _recurrencies$ = new BehaviorSubject<Recurrency[]>([])

  constructor() {
    // TESTING ONLY!
    setTimeout(() => {
      console.log('timeout 1000')
      this.emitRecurrencies(DATAS)
    }, 1000);
  }

  getAll$(): Observable<Recurrency[]> {
    return this._recurrencies$.asObservable()
  }

  getById$(id: string): Observable<Recurrency | undefined> {
    return this._recurrencies$.asObservable().pipe(
      map(recs => recs.find(rec => rec.id === id))
    )
  }

  /**
   * Adds a data to the database. 
   * A unique identifier will be automatically generated.
   * The Recurrency.id field will be ignored.
   */
  add(recurrency: Recurrency, timezone: TimezoneString): Promise<Recurrency> {
    const id = Math.round(Math.random() * 100000000).toString()
    const newRecurrency = {id, ...recurrency}
    const data = toRecurrencyData(newRecurrency, timezone)

    DATAS[id] = data
    this.emitRecurrencies(DATAS)
    return Promise.resolve(newRecurrency)
  }

  /**
   * Adds or overwrite a data to the database. The identifier is set to the "recurrency.id" field. 
   * If the recurrency.id field already exists in the database, the corresponding data will be overwritten.
   */
  set(recurrency: Required<Recurrency>, timezone: TimezoneString): Promise<Recurrency> {
    const {id, ...rest} = recurrency

    DATAS[id] = toRecurrencyData(rest, timezone)
    this.emitRecurrencies(DATAS)
    return Promise.resolve(recurrency)
  }

  /**
   * Adds or overwerite data to the database.
   */
  save(recurrency: Recurrency, timezone: TimezoneString): Promise<Recurrency> {
    return recurrency.id === undefined 
    ? this.add(recurrency, timezone) 
    : this.set((recurrency as Required<Recurrency>), timezone)
  }

  // TODO
  delete(id: string): Promise<void> {
    delete DATAS[id]
    this.emitRecurrencies(DATAS)
    return Promise.resolve()
  }

  private toArr(data: Record<string,Record<string, any>>): Record<string, any>[] {
    const dataEntries = Object.entries(data)
    if (dataEntries.length === 0) return []
    return dataEntries.map(([key, value]) => ({id: key, ...value}))
  }

  private emitRecurrencies(data: Record<string,Record<string, any>>) {
    const recurrencies = this.toArr(DATAS).map(data => toRecurrency(data as RecurrencyData, data['id']))
    this._recurrencies$.next(recurrencies)
  }

  TEST() {}

}