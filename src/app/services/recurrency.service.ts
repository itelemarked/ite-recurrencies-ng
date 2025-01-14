import { Injectable } from "@angular/core";
import { BehaviorSubject, delay, filter, map, Observable } from "rxjs";
import { Recurrency, toRecurrency } from "../types/Recurrency";

let DATAS: Record<string, any> = {
  'aaaaaa': {
    title: 'PU',
    lastEvent: '2024-12-10',
    periodNb: 132,
    periodUnit: 'days'
  },
  'bbbbbb': {
    title: 'EC',
    lastEvent: '2024-12-11',
    periodNb: 66,
    periodUnit: 'days'
  },
  'cccccc': {
    title: 'PC-6',
    lastEvent: '2024-12-09',
    periodNb: 188,
    periodUnit: 'days'
  },
  'dddddd': {
    title: 'PC-7',
    lastEvent: '2024-12-09',
    periodNb: 94,
    periodUnit: 'days'
  },
}


@Injectable({providedIn: 'root'})
export class RecurrencyService {

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

  // TODO!!!
  // set(recurrency: Recurrency): Promise<any> {
  //   if (recurrency.id === undefined) {
  //     const id = Math.round(Math.random() * 10000000).toString()
  //     DATAS[id] = recurrency
  //   } else {
  //     DATAS[recurrency.id] = recurrency
  //   }
  //   return Promise.resolve(DATAS)
  // }

  constructor() {
    setTimeout(() => {
      const recurrencies = this.recurrenciesFromData(DATAS)
      this._recurrencies$.next(recurrencies)
    }, 1000);
    
    // const rec: Recurrency = {
    //   id: 'aaaaaa',
    //   title: 'aaa',
    //   lastEvent: new Date(),
    //   periodNb: toPositiveInteger(99),
    //   periodUnit: toPeriodUnit('days')
    // }
    // this.set(rec).then(console.log)
  }

  private recurrenciesFromData(data: Record<string, any>): Recurrency[] {
    const dataEntries = Object.entries(DATAS)
    if (dataEntries.length === 0) return []
    const recurrencies = dataEntries.map(([key, value]) => toRecurrency(value, key))
    return recurrencies
  }


}