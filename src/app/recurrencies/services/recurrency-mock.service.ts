import { inject, Injectable } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { BehaviorSubject, combineLatest, delay, map, Observable, of, startWith, switchMap, tap } from "rxjs";

import { TIMEZONE, Timezone } from "../../../js/timezone-date/types/Timezone";
import { TimeString } from "../../../js/timezone-date/types/TimeString";
import { isRecurrency, Recurrency } from "../types/Recurrency.type";
import { get$ } from "./mock-datas";
import { isInterface, isPlainObject, isString } from "../../../js/valid-type";
import { isTimezoneDate, TimezoneDate } from "src/js/timezone-date/TimezoneDate";
import { DateString, isDateString } from "src/js/timezone-date/types/DateString.type";
import { SHORT_BEFORE_MIDNIGHT } from "src/js/date";
import { isPositiveInteger, PositiveInteger } from "../types/PositiveInteger.type";
import { isPeriodUnit, PeriodUnit } from "src/js/timezone-date/types/PeriodUnit.type";


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
    return combineLatest([this.userService.user$, this.settingsService.settings$]).pipe(
      switchMap(([usr, settings]) => {
        if(usr === null) {
          return of([] as Recurrency[])
        } 

        return get$(`users/${usr.uid}/recurrencies`).pipe(
          map(dataObj => {
            if(dataObj === null) return []
            if(!isPlainObject(dataObj)) return []

            // const recurrencies = Object.entries(data).map(([uid, value]) => ({uid, ...value}))
            // if(recurrencies.some(rec => !isRecurrency(rec))) return []
            // return recurrencies as Recurrency[]

            const isValidData = isInterface<{
              uid: string,
              title: string,
              lastEvent: DateString,
              periodNb: PositiveInteger,
              periodUnit: PeriodUnit,
              category: string
            }>({
              uid: [isString],
              title: [isString],
              lastEvent: [isDateString],
              periodNb: [isPositiveInteger],
              periodUnit: [isPeriodUnit],
              category: [isString]
            })

            const dataArr = Object.entries(dataObj).map(([uid, value]) => ({uid, ...value}))

            if(!dataArr.every(el => isValidData(el))) {
              return []
            }

            const recurrencies = dataArr.map((value) => ({
              ...value,
              lastEvent: TimezoneDate.create(value.lastEvent, SHORT_BEFORE_MIDNIGHT, settings.timezone)
            })) 
            return recurrencies
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