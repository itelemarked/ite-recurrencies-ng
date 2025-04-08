// @ts-nocheck
import { inject, Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { BehaviorSubject, map, of, skip, switchMap, take, tap } from "rxjs";

import { AuthService } from "../../__Archives__/auth1.service";
import { SettingsService } from "./settings1.service";

import { Recurrency, toRecurrency } from "../types/Recurrency";

import { endOf, format } from "../utils/date/date.utils";
import { TimezoneString } from "@shared/types/TimezoneString";




/**
 * Recurrencies must be updated/emitted when:
 * a) the user changes (have to fetch data on firestore)
 * b) the timezone changes (the "lastEvent: Date" time must be updated to the new timezone.)
 */

export function toRecurrencyData(recurrency: Recurrency, timezone: TimezoneString) {
  const { title, lastEvent, periodNb, periodUnit } = recurrency

  return {
    title,
    lastEvent: format(lastEvent, 'YYYY-MM-DD', timezone),
    periodNb,
    periodUnit
  }
}

@Injectable({providedIn: 'root'})
export class Recurrency1Service {

  // DEPENDENCIES
  private firestore = inject(AngularFirestore)
  private AuthService = inject(AuthService)
  private settingsService = inject(SettingsService)

  // PROPERTIES
  private _currentRecurrencies: Recurrency[] = []
  public currentRecurrencies = (): Recurrency[] => this._currentRecurrencies
  private _recurrencies$$ = new BehaviorSubject<Recurrency[]>([])
  public recurrencies$$ = this._recurrencies$$.asObservable()

  private _isLoading$ = new BehaviorSubject<boolean>(true)
  // Will emit twice in the constructor. We only need the second emission (when the data has been first fetched)
  public isLoading$ = this._isLoading$.asObservable()

  constructor() {
    // When user or recurrencies change on firestore (realtime updates), update and emits new recurrencies
    // Subscription to user$$ is long lasting (no need to unsubscribe)
    // Using switchMap is convenient, because no need to implement unsubscription of the specific recurrencies path in case user changes
    const recurrenciesFromFirestore$$ = this.AuthService.user$$
      .pipe(
        switchMap(user => {
          return user === null 
            ? of([])
            : this.firestore.collection<unknown>(`users/${user.uid}/recurrencies`).snapshotChanges().pipe(
                map(snapshots => snapshots.map(snap => {
                  const timezone = this.settingsService.currentSettings().timezone
                  const id = snap.payload.doc.id
                  const data = snap.payload.doc.data()
                  return toRecurrency(data, timezone, id)
                }))
              )
        })
      )

    recurrenciesFromFirestore$$.subscribe(recs => {
      this._currentRecurrencies = recs
      this._recurrencies$$.next(recs)
    })

    recurrenciesFromFirestore$$.pipe(take(2), skip(1)).subscribe(_ => {
      // this._hasLoaded$ will emit at least twice: at the beginning once when subscribing and once when fetched for the first time.
      this._isLoading$.next(false)
    })

    // When timezone change, update and emits new recurrencies
    // Subscription to settings$$ is long lasting (no need to unsubscribe)
    this.settingsService.settings$$.subscribe(settings => {
      const newRecurrencies = this._recurrencies$$.value.map(rec => {
        const newLastEvent = endOf(rec.lastEvent, 'days', settings.timezone)
        return { ...rec, lastEvent: newLastEvent }
      })
      this._currentRecurrencies = newRecurrencies
      this._recurrencies$$.next(newRecurrencies)
    })
  }

  /**
   * Adds a data to the database. 
   * A unique identifier will be automatically generated.
   * The Recurrency.id field will be ignored.
   * Rejects if User is not logged in.
   */
  async add(recurrency: Recurrency): Promise<Recurrency> {
    const user = this.AuthService.currentUser()
    const timezone = this.settingsService.currentSettings().timezone

    if (user === null) return Promise.reject('User is null')
    
    const firebaseDocRef = await this.firestore.collection<unknown>(`users/${user.uid}/recurrencies`).add(toRecurrencyData(recurrency, timezone))
    const id = firebaseDocRef.id
    return { ...recurrency, id }
  }

  /**
   * Adds or overwrite a data to the database. The identifier is set to the "recurrency.id" field. 
   * If the recurrency.id field already exists in the database, the corresponding data will be overwritten.
   * Rejects if User is not logged in.
   */
  async set(recurrency: Required<Recurrency>): Promise<Recurrency> {
    const user = this.AuthService.currentUser()
    const timezone = this.settingsService.currentSettings().timezone

    if (user === null) return Promise.reject('User is null')
    
    await this.firestore.doc<unknown>(`users/${user.uid}/recurrencies/${recurrency.id}`).set(toRecurrencyData(recurrency, timezone))
    return { ...recurrency }
  }

  /**
   * Shortcut for add() and set() (Adds or overwerite data to the database).
   */
  async save(recurrency: Recurrency): Promise<Recurrency> {
    return recurrency.id === undefined ? this.add(recurrency) : this.set(recurrency as Required<Recurrency>)
  }

  /**
   * Deletes the recurrency specified with the corresponding id.
   * Rejects if:
   * - User is not logged in
   * - No id found on the database (nothing to delete)
   */
  async delete(id: string): Promise<void> {
    const user = this.AuthService.currentUser()
    if (user === null) return Promise.reject('User is null!')

    const idToDelete = this._currentRecurrencies.find(rec => rec.id === id) 
    if(idToDelete === undefined) return Promise.reject('Nothing to delete!')

    return this.firestore.doc<unknown>(`users/${user.uid}/recurrencies/${id}`).delete()
  }
  
  TEST() {}
}