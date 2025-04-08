// @ts-nocheck
import { computed, inject, Injectable, signal } from "@angular/core";
import { AngularFirestore, DocumentChangeAction } from "@angular/fire/compat/firestore";
import { toObservable } from "@angular/core/rxjs-interop";

import { map, of, switchMap } from "rxjs";

import { Recurrency, toRecurrency } from "../types/Recurrency";
import { User } from "../types/User";
import { toDateString } from "../types/DateString";
import { TimezoneString } from "../types/TimezoneString";
import { toTimeString } from "../types/TimeString";
import { createTimezoneDate } from "../utils/date/date.utils";
import { toPositiveInteger } from "../types/PositiveInteger";
import { toPeriodUnit } from "../types/PeriodUnit";
import { AuthService } from "../../__Archives__/auth2.service";



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
        return this.firestore.collection<unknown>(`users/${usr.uid}/recurrencies`).snapshotChanges().pipe(
          map(recs => recs.map(rec => toRecurrency(rec, 'Europe/Zurich')))
        )
      })
    )

    recurrencies$$.subscribe(recs => this._recurrencies.set(recs))
  }
  
  TEST() {}
}
