import { inject, Injectable } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { BehaviorSubject, combineLatest, delay, map, Observable, of, startWith, switchMap, tap } from "rxjs";

import { TIMEZONE, Timezone } from "../types/Timezone";
import { TimeString } from "../types/TimeString";
import { isRecurrency, Recurrency } from "../types/Recurrency.type";
import { get$ } from "./mock-datas";
import { isPlainObject } from "../../../js/valid-type";


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
    return this.userService.user$.pipe(
      switchMap((usr) => {
        if(usr === null) {
          return of([] as Recurrency[])
        } 

        return get$(`users/${usr.uid}/recurrencies`).pipe(
          map(data => {
            if(data === null) return []
            if(!isPlainObject(data)) return []
            const recurrencies = Object.entries(data).map(([uid, value]) => ({uid, ...value}))
            if(recurrencies.some(rec => !isRecurrency(rec))) return []
            return recurrencies as Recurrency[]
          })
        )
      }),
      startWith([] as Recurrency[])
    )
  }

  // getter as Signal
  recurrencies = toSignal(this.recurrencies$(), {requireSync: true})

  // add
  // add(): Promise<string> {
  //   const uid = this.generateUUID()
  // }

  private generateUUID() {
    return (Math.random() * 1000000000).toString()
  }

}