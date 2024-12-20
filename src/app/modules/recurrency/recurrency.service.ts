import { Injectable } from "@angular/core";
import { RecurrencyData } from "./interfaces/RecurrencyData";
import { BehaviorSubject, delay, filter, map, Observable } from "rxjs";
import { Recurrency, toRecurrency } from "./interfaces/Recurrency";

const DATAS: RecurrencyData[] = [
  {
    title: 'PU',
    lastEvent: '2024-12-10',
    periodNb: 132,
    periodUnit: 'days'
  },
  {
    title: 'EC',
    lastEvent: '2024-12-11',
    periodNb: 66,
    periodUnit: 'days'
  },
  {
    title: 'PC-6',
    lastEvent: '2024-12-09',
    periodNb: 188,
    periodUnit: 'days'
  },
  {
    title: 'PC-7',
    lastEvent: '2024-12-09',
    periodNb: 94,
    periodUnit: 'days'
  },
]


@Injectable({providedIn: 'root'})
export class RecurrencyService {

  // private _recurrencies$: BehaviorSubject<Recurrency[]> = new BehaviorSubject(DATAS.map(d => toRecurrency(d)))
  private _recurrencies$ = new BehaviorSubject<Recurrency[]>([])

  getAll$(): Observable<Recurrency[]> {
    return this._recurrencies$.asObservable()
  }

  // TODO: replace title by an id...
  getById$(id: string): Observable<Recurrency | undefined> {
    return this._recurrencies$.asObservable().pipe(
      map(recs => recs.find(rec => rec.title === id))
    )
  }

  constructor() {
    setTimeout(() => {
      this._recurrencies$.next(DATAS.map(d => toRecurrency(d)))
    }, 1000);
  }

}