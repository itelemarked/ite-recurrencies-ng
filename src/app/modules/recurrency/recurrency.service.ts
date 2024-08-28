import { computed, Injectable, Signal, signal } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { Recurrency, SETUP } from "./Recurrency";

export interface IRecurrencyData {
  id: string,
  title: string,
  lastEvent: string,
  periodNb: number,
  periodUnit: string
}

let RECURRENCIES: IRecurrencyData[] = [
  {id: '0.3229625687065407', title: 'PC-7', lastEvent: '2024-08-22', periodNb: 94, periodUnit: 'days'},
  {id: '0.764443601617917', title: 'EC', lastEvent: '2024-08-22', periodNb: 66, periodUnit: 'days'}
]

function fromData(data: IRecurrencyData): Recurrency {
  return new Recurrency(data.title, data.lastEvent, data.periodNb, data.periodUnit, data.id)
}

function toData(recurrency: Recurrency): IRecurrencyData {
  return {
    id: recurrency.id(),
    title: recurrency.title(),
    lastEvent: recurrency.lastEvent().toString({format: 'YYYY-MM-DD', offset: SETUP.offset}),
    periodNb: recurrency.periodNb(),
    periodUnit: recurrency.periodUnit()
  }
}


interface IRecurrencyService {
  getRecurrencies$(): Observable<Recurrency[]>,
  add(recurrency: Recurrency): Promise<void>,
  update(recurrency: Recurrency): Promise<void>,
  remove(recurrency: Recurrency): Promise<void>,
}


@Injectable({providedIn: 'root'})
export class RecurrencyService {

  private _recurrencies$ = new BehaviorSubject<Recurrency[]>([])
  // private _recurrencies: Signal<Recurrency[]> = signal([])

  constructor() {
    this._recurrencies$.next(RECURRENCIES.map(r => fromData(r)))
  }

  getRecurrencies$(): Observable<Recurrency[]> {
    return this._recurrencies$.asObservable()
  }

  add(recurrency: Recurrency): Promise<void> {
    return new Promise(resolve => {
      setTimeout(() => {
        RECURRENCIES.push(toData(recurrency))
        this._recurrencies$.next(RECURRENCIES.map(r => fromData(r)))
        resolve()
      }, 500);
    })
  }

  remove(recurrency: Recurrency): Promise<void> {
    return new Promise(resolve => {
      setTimeout(() => {
        RECURRENCIES = RECURRENCIES.filter(r => fromData(r).id() !== recurrency.id())
        this._recurrencies$.next(RECURRENCIES.map(r => fromData(r)))
        resolve()
      }, 500);
    })
  }

  update(recurrency: Recurrency): Promise<void> {
    return new Promise(resolve => {
      setTimeout(() => {
        RECURRENCIES = RECURRENCIES.map(r => {
          const rec = fromData(r)
          return rec.id() === recurrency.id() ? toData(recurrency) : toData(rec)
        })
        this._recurrencies$.next(RECURRENCIES.map(r => fromData(r)))
        resolve()
      }, 500);
    })
  }

}