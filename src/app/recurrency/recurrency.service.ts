import { computed, effect, inject, Injectable, signal, Signal } from "@angular/core";
import { combineLatestWith, firstValueFrom, from, lastValueFrom, map, mergeMap, Observable, of, switchMap, take, tap, throwError, zipWith } from "rxjs";
import { IRecurrency, IRecurrencyData, toRecurrency } from "../_interfaces/IRecurrency";
import { AngularFirestore, AngularFirestoreCollection } from "@angular/fire/compat/firestore";
import { AuthService } from "../auth/auth.service";
import { SettingsService } from "../settings/settings.service";
import { toObservable, toSignal } from "@angular/core/rxjs-interop";
import { ISettings } from "../_interfaces/ISettings";
import { IStoreCollection } from "../_interfaces/IStoreCollection";
import { IUser } from "../_interfaces/IUser";
import { toDateString } from "../_types/DateString";
import { toPositiveInteger } from "../_types/PositiveInteger";
import { toPeriodUnit } from "../_types/PeriodUnit";


@Injectable({providedIn: 'root'})
export class RecurrencyService implements IStoreCollection<IRecurrency> {

  private _firestore = inject(AngularFirestore)
  private _auth = inject(AuthService)
  private _user$ = toObservable(this._auth.user$)

  private _recurrencies$ = this._getRecurrencies$(this._auth, this._firestore)


  private _getRecurrencies$(auth: AuthService, fs: AngularFirestore) {
    const authObs$ = toObservable(auth.user$)
    const recurrenciesObs$ =  authObs$.pipe(
      switchMap(usr => {
        if (usr === null) return of([])
        return fs.collection<IRecurrencyData>(`users/${usr.id}/recurrencies`).snapshotChanges().pipe(
          map(res => res.map(r => {
            const id = r.payload.doc.id
            const data = r.payload.doc.data()
            const newRecurrency = toRecurrency({id, ...data})
            return newRecurrency
          }))
        )
      })
    )
    const recurrenciesSig$ = toSignal(recurrenciesObs$, {initialValue: []})
    return recurrenciesSig$
  }


  private async _save(recurrency: IRecurrency) {
    const observable$ = this._user$.pipe(
      mergeMap(usr => {
        if (usr === null) return throwError(() => new Error(`User is null`))

        const collRef = this._firestore.collection<IRecurrency>(`users/${usr.id}/recurrencies`)
        if (recurrency.id === undefined) {
          return from(collRef.add(recurrency))
        }
        const {id, ...data} = recurrency
        return from(collRef.doc(id).set(data)).pipe(map(_ => recurrency))
      }),
      map(res => ({...recurrency, id: res.id} as IRecurrency) )
    )

    return firstValueFrom(observable$)
  }

  // TODO: working, but need a bit of refactoring...!!
  private async _remove(id: string) {
    const observable$ = this._user$.pipe(
      mergeMap(usr => {
        if (usr === null) return throwError(() => new Error(`User is null`))
        return of(usr)
      }),
      mergeMap(usr => {
        return this._firestore.collection<IRecurrency>(`users/${usr.id}/recurrencies`).doc<IRecurrency>(id).get().pipe(
          map(rec => ({user: usr, rec: {id, ...rec.data()!} }))
        )
      }),
      mergeMap(({user, rec}) => {
        return from(this._firestore.collection<IRecurrency & {id: string}>(`users/${user.id}/recurrencies`).doc(id).delete()).pipe(map(_ => rec ))
      })
    )

    return firstValueFrom(observable$)
  }

  // PUBLIC

  getAll$() {
    return this._recurrencies$
  }

  getById$(id: string) {
    return null
  }


  save(recurrency: IRecurrency) {
    return this._save(recurrency)
  }

  remove(id: string) {
    return this._remove(id)
  }


}


