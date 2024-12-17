import { Injectable } from "@angular/core";
import { RecurrencyData } from "./interfaces/RecurrencyData";
import { delay, Observable, of } from "rxjs";
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

  getAll$(): Observable<Recurrency[]> {
    return of(DATAS.map(d => toRecurrency(d))).pipe(delay(300))
  }

}