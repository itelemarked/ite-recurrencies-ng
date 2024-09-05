import { computed, inject, Injectable, Signal, signal } from "@angular/core";
import { BehaviorSubject, map, Observable, switchMap } from "rxjs";
import { Recurrency, SETUP } from "./Recurrency";
import { IStore } from "../../core/stores/store.interface";
import { FirebaseStoreService } from "../../core/stores/firebase-store.service";
import { PeriodUnit } from "./types/PeriodUnit";

export interface IRecurrencyData {
  firebaseId: string,
  title: string,
  lastEvent: string,
  periodNb: number,
  periodUnit: string
}

function fromData(data: IRecurrencyData): Recurrency {
  return new Recurrency(data.title, data.lastEvent, data.periodNb, data.periodUnit, data.firebaseId)
}

function toData(recurrency: Recurrency): IRecurrencyData {
  return {
    firebaseId: recurrency.id(),
    title: recurrency.title(),
    lastEvent: recurrency.lastEvent().toString({format: 'YYYY-MM-DD', offset: SETUP.offset}),
    periodNb: recurrency.periodNb(),
    periodUnit: recurrency.periodUnit()
  }
}


@Injectable({providedIn: 'root'})
export class RecurrencyService {

  private store: IStore = inject(FirebaseStoreService)
  
  get$(user$: Observable<{id: string}>): Observable<Recurrency[]> {
    return user$.pipe(
      switchMap(usr => this.store.get$<IRecurrencyData[]>(`users/${usr.id}/recurrencies`)),
      map(res => res === null ? []: res.map(fromData))
    )
  }

  // TODO
  // set() {}
  // delete() {}

}




// let RECURRENCIES: IRecurrencyData[] = [
//   {id: '0.3229625687065407', title: 'PC-7', lastEvent: '2024-08-22', periodNb: 94, periodUnit: 'days'},
//   {id: '0.764443601617917', title: 'EC', lastEvent: '2024-08-22', periodNb: 66, periodUnit: 'days'}
// ]




// interface IRecurrencyService {
//   getRecurrencies$(): Observable<Recurrency[]>,
//   add(recurrency: Recurrency): Promise<void>,
//   update(recurrency: Recurrency): Promise<void>,
//   remove(recurrency: Recurrency): Promise<void>,
// }


// @Injectable({providedIn: 'root'})
// export class RecurrencyService {

//   private _recurrencies$ = new BehaviorSubject<Recurrency[]>([])
//   // private _recurrencies: Signal<Recurrency[]> = signal([])

//   constructor() {
//     this._recurrencies$.next(RECURRENCIES.map(r => fromData(r)))
//   }

//   getRecurrencies$(): Observable<Recurrency[]> {
//     return this._recurrencies$.asObservable()
//   }

//   add(recurrency: Recurrency): Promise<void> {
//     return new Promise(resolve => {
//       setTimeout(() => {
//         RECURRENCIES.push(toData(recurrency))
//         this._recurrencies$.next(RECURRENCIES.map(r => fromData(r)))
//         resolve()
//       }, 500);
//     })
//   }

//   remove(recurrency: Recurrency): Promise<void> {
//     return new Promise(resolve => {
//       setTimeout(() => {
//         RECURRENCIES = RECURRENCIES.filter(r => fromData(r).id() !== recurrency.id())
//         this._recurrencies$.next(RECURRENCIES.map(r => fromData(r)))
//         resolve()
//       }, 500);
//     })
//   }

//   update(recurrency: Recurrency): Promise<void> {
//     return new Promise(resolve => {
//       setTimeout(() => {
//         RECURRENCIES = RECURRENCIES.map(r => {
//           const rec = fromData(r)
//           return rec.id() === recurrency.id() ? toData(recurrency) : toData(rec)
//         })
//         this._recurrencies$.next(RECURRENCIES.map(r => fromData(r)))
//         resolve()
//       }, 500);
//     })
//   }

// }