import { inject, Injectable } from "@angular/core";
import { RecurrencyServiceInterface } from "../types/RecurrencyServiceInterface";
import { combineLatest, delay, Observable, of, startWith, switchMap, tap } from "rxjs";
import { User } from "@app/_types/User";
import { MOCK_DATAS } from "./mock-datas";
import { Recurrency } from "../models/Recurrency.model";
import { TimezoneDate } from "../models/TimezoneDate.model";
import { TimeString } from "@app/_types/TimeString";
import { TIMEZONE, Timezone } from "@app/_types/Timezone";
import { toSignal } from "@angular/core/rxjs-interop";


// TODO: implement in auth instead of here... only TEMPO!
@Injectable({providedIn: "root"})
export class TempoUserService {
  user$ = of<User>({
    uid: '0yuA0RLZFJdbRKtVSfW4y5HSQMq1',
    email: 'aaa@aaa.com'
  }).pipe(
    delay(300),
    startWith(null),
  )
}

// TODO: only TEMPO!
@Injectable({providedIn: "root"})
export class TempoSettingsService {
  settings$ = of<{
    timezone: Timezone
  }>({
    timezone: TIMEZONE.ZURICH
  }).pipe(
    delay(2000),
    startWith({
      timezone: TIMEZONE.MAURITIUS
    }),
  )
}

const SHORT_BEFORE_MIDNIGHT = '23:59:59.999' as TimeString



@Injectable({providedIn: "root"})
export class RecurrencyMockService implements RecurrencyServiceInterface {

  private userService = inject(TempoUserService)
  private settingsService = inject(TempoSettingsService)

  recurrencies$(): Observable<Recurrency[]> {
    return combineLatest([this.userService.user$, this.settingsService.settings$]).pipe(
      switchMap(([usr, settings]) => {
        if(usr === null) {
          return of([]).pipe(delay(400))
        } 

        const data = MOCK_DATAS?.users?.['0yuA0RLZFJdbRKtVSfW4y5HSQMq1']?.recurrencies
        if(data === undefined) return of([])

        const mappedData = Object.entries(data)
        // TODO: validate data!
        const isRecurrency = (val: any) => true
        if(mappedData.some(([_, value]) => !isRecurrency(value))) return of([])

        const recurrencies = mappedData.map(([key, value]: [string, any]) => {
          const uid = key
          const title = value.title
          const lastEvent = new TimezoneDate(value.lastEvent, SHORT_BEFORE_MIDNIGHT, settings.timezone)
          const periodNb = value.periodNb
          const periodUnit = value.periodUnit
          return new Recurrency(uid, title, lastEvent, periodNb, periodUnit)
        })

        return of(recurrencies)
      }),
      startWith([])
    )
  }

  recurrencies = toSignal(this.recurrencies$(), {requireSync: true})

}