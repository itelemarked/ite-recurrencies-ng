import { inject, Injectable } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { BehaviorSubject, combineLatest, delay, map, Observable, of, startWith, switchMap, tap } from "rxjs";

import { TIMEZONE, Timezone } from "../../../js/timezone-date/types/Timezone";
import { isRecurrency, isRecurrencyData, Recurrency, RecurrencyData } from "../types/Recurrency.type";
import { isInterface, isPlainObject, isString } from "../../../js/valid-type";


// TODO: export whereelse...
type User = {
  uid: string,
  email: string
}


// TODO: implement in auth instead of here... only TEMPO!
// NULL --> 300ms --> USER
@Injectable({providedIn: "root"})
export class TempoUserService {
  user$ = of<User>({
    uid: '0yuA0RLZFJdbRKtVSfW4y5HSQMq1',
    email: 'aaa@aaa.com'
  })
  // .pipe(
  //   delay(300),
  //   startWith(null),
  // )
}

// TODO: only TEMPO!
// MAURITIUS --> 2000ms --> ZURICH
@Injectable({providedIn: "root"})
export class TempoSettingsService {
  settings$ = of<{
    timezone: Timezone
  }>({
    timezone: TIMEZONE.ZURICH
  })
  // .pipe(
  //   delay(2000),
  //   startWith({
  //     timezone: TIMEZONE.MAURITIUS
  //   }),
  // )
}



@Injectable({providedIn: "root"})
export class RecurrencyMockService {

  private userService = inject(TempoUserService)
  private settingsService = inject(TempoSettingsService)

  // getter as Observable
  recurrencies$() {
    // return combineLatest([this.userService.user$, this.settingsService.settings$]).pipe(
    //   switchMap(([usr, settings]) => {
    //     if(usr === null) {
    //       return of([] as Recurrency[])
    //     } 

    //     return get$(`users/${usr.uid}/recurrencies`).pipe(
    //       map(dataObj => {
    //         if(dataObj === null) return []
    //         if(!isPlainObject(dataObj)) return []

    //         const dataArr = Object.entries(dataObj)
    //         if(dataArr.some(([uid, data]) => !isRecurrencyData(data))) return []

    //         const recurrencies = dataArr.map(([uid, data]: [string, RecurrencyData]) => new Recurrency(uid, data, settings.timezone))
    //         return recurrencies
    //       })
    //     )
    //   }),
    //   startWith([] as Recurrency[])
    // )
    return of([])
  }

  // getter as Signal
  recurrencies = toSignal(this.recurrencies$(), {requireSync: true})

  private generateUUID() {
    return (Math.random() * 1000000000).toString()
  }

}