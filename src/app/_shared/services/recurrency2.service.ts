
import { computed, inject, Injectable, signal } from "@angular/core";
import { AngularFirestore, DocumentChangeAction } from "@angular/fire/compat/firestore";
import { toObservable } from "@angular/core/rxjs-interop";

import { map, of, switchMap } from "rxjs";

import { Recurrency } from "../types/Recurrency";
import { User } from "../types/User";
import { toDateString } from "../types/DateString";
import { TimezoneString } from "../types/TimezoneString";
import { toTimeString } from "../types/TimeString";
import { createTimezoneDate } from "../utils/date/date.utils";
import { toPositiveInteger } from "../types/PositiveInteger";
import { toPeriodUnit } from "../types/PeriodUnit";
import { AuthService } from "../../__Archives__/auth2.service";




type RecurrencyData = {
  title: string,
  lastEvent: string,
  periodNb: number,
  periodUnit: string
}

export function toRecurrency(docData: DocumentChangeAction<RecurrencyData>, timezone: TimezoneString): Recurrency {
  const id = docData.payload.doc.id
  
  const data = docData.payload.doc.data()
  
  const dateString = toDateString(data.lastEvent)
  const timeString = toTimeString('23:59:59.999')
  const lastEvent = createTimezoneDate({dateString, timeString, timezone})

  const title = data.title
  const periodNb = toPositiveInteger(data.periodNb)
  const periodUnit = toPeriodUnit(data.periodUnit)

  return {
    id,
    title,
    lastEvent,
    periodNb,
    periodUnit
  }
}

@Injectable({providedIn: 'root'})
export class Recurrency2Service {

  private firestore = inject(AngularFirestore)
  private AuthService = inject(AuthService)

  private _recurrencies = signal<Recurrency[] | undefined>(undefined)
  public recurrencies = computed(() => this._recurrencies())

  constructor() {

    const user$$ = toObservable<User | null | undefined>(this.AuthService.user)
    const recurrencies$$ = user$$.pipe(
      switchMap(usr => {
        if(usr === undefined)  return of(undefined)
        if(usr === null) return of([])
        return this.firestore.collection<RecurrencyData>(`users/${usr.uid}/recurrencies`).snapshotChanges().pipe(
          map(recs => recs.map(rec => toRecurrency(rec, 'Europe/Zurich')))
        )
      })
    )

    recurrencies$$.subscribe(recs => this._recurrencies.set(recs))
  }
  
  TEST() {}
}
