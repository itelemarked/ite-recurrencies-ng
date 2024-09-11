import { inject, Injectable, Signal } from "@angular/core";
import { combineLatestWith, lastValueFrom, map, Observable, of, switchMap, take, zipWith } from "rxjs";
import { IRecurrency, Recurrency } from "./Recurrency";
import { User } from "../auth/User";
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { AuthService } from "../auth/auth.service";
import { ISettings, SettingsService } from "../settings/settings.service";
import { toObservable, toSignal } from "@angular/core/rxjs-interop";

export interface IRecurrencyData {
  title: string,
  lastEvent: string,
  periodNb: number,
  periodUnit: string
}

function fromData(id: string, data: IRecurrencyData, offset?: string): Recurrency {
  return new Recurrency(data.title, data.lastEvent, data.periodNb, data.periodUnit, id, offset)
}
  
function toData(recurrency: Recurrency, offset: string = '+00:00'): IRecurrencyData {
  return {
    title: recurrency.title(),
    lastEvent: recurrency.lastEvent().toString({format: 'YYYY-MM-DD', offset}),
    periodNb: recurrency.periodNb(),
    periodUnit: recurrency.periodUnit()
  }
}


@Injectable({providedIn: 'root'})
export class RecurrencyService {

  private _firestore = inject(AngularFirestore)
  private _authService = inject(AuthService)
  private _settingsService = inject(SettingsService)

  recurrenciesSig = toSignal(this._getRecurrencies$(), {initialValue: []})

  async add(recurrency: Recurrency) {
    const userSig = this._authService.userSig
    const settingsSig = this._settingsService.settingsSig

    await this._firestore.collection<IRecurrencyData>(`users/${userSig()?.id()}/recurrencies`).doc(recurrency.id()).set(toData(recurrency, settingsSig()?.timezone))
  }
  

  private _getRecurrencies$() {
    const user$ = toObservable(this._authService.userSig)

    const getSettings$ = (user: User | null) => {
      return this._firestore.doc<ISettings | null>(`users/${user?.id()}/settings/0`).valueChanges().pipe(
        map(res => {
          if(res === undefined) return null
          return res
        }),
        map(res => {
          const result: [User | null, ISettings | null] = [user, res]
          return result
        })
      )
    }

    const getRecurrencies$ = (user: User | null, settings: ISettings | null) => {
      return this._firestore.collection<IRecurrencyData>(`users/${user?.id()}/recurrencies`).snapshotChanges().pipe(
        map(res => res.map(r => {
          const id = r.payload.doc.id
          const data = r.payload.doc.data()
          return fromData(id, data, settings?.timezone)
        }))
      )
    }

    return user$.pipe(
      switchMap( user => getSettings$(user) ),
      switchMap( ([user, settings]) => getRecurrencies$(user, settings) )
    )
  }

  


}


