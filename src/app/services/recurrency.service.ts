import { inject, Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { BehaviorSubject, map, of, switchMap } from "rxjs";

import { UserService } from "./user.service";
import { SettingsService } from "./settings.service";

import { Recurrency, RecurrencyData, toRecurrency, toRecurrencyData } from "../types/Recurrency";

import { endOf } from "../utils/date/date.utils";



/**
 * Recurrencies must be updated/emitted when:
 * a) the user changes (have to fetch data on firestore)
 * b) the timezone changes (the "lastEvent: Date" time must be updated to the new timezone.)
 */

@Injectable({providedIn: 'root'})
export class RecurrencyService {

  // DEPENDENCIES
  private firestore = inject(AngularFirestore)
  private userService = inject(UserService)
  private settingsService = inject(SettingsService)

  // PROPERTIES
  private _recurrencies$$ = new BehaviorSubject<Recurrency[]>([])
  public recurrencies$$ = this._recurrencies$$.asObservable()
  public currentRecurrencies = () => this._recurrencies$$.value

  constructor() {
    // When user or recurrencies change on firestore (realtime updates), update and emits new recurrencies
    // Subscription to user$$ is long lasting (no need to unsubscribe)
    // Using switchMap is convenient, because no need to implement unsubscription of the specific recurrencies path in case user changes
    this.userService.user$$
      .pipe(
        switchMap(user => {
          return user === null 
            ? of([])
            : this.firestore.collection<RecurrencyData>(`users/${user.uid}/recurrencies`).snapshotChanges().pipe(
                map(snapshots => snapshots.map(snap => {
                  const timezone = this.settingsService.currentSettings().timezone
                  const id = snap.payload.doc.id
                  const data = snap.payload.doc.data()
                  return toRecurrency(data, timezone, id)
                }))
              )
        }) 
      )
      .subscribe(recs => this._recurrencies$$.next(recs))

    // When timezone change, update and emits new recurrencies
    // Subscription to settings$$ is long lasting (no need to unsubscribe)
    this.settingsService.settings$$.subscribe(settings => {
      const newRecurrencies = this._recurrencies$$.value.map(rec => {
        const newLastEvent = endOf(rec.lastEvent, 'days', settings.timezone)
        return { ...rec, lastEvent: newLastEvent }
      })
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
    const user = this.userService.currentUser()
    const timezone = this.settingsService.currentSettings().timezone

    if (user === null) return Promise.reject('User is null')
    
    const firebaseDocRef = await this.firestore.collection<RecurrencyData>(`users/${user.uid}/recurrencies`).add(toRecurrencyData(recurrency, timezone))
    const id = firebaseDocRef.id
    return { ...recurrency, id }
  }

  /**
   * Adds or overwrite a data to the database. The identifier is set to the "recurrency.id" field. 
   * If the recurrency.id field already exists in the database, the corresponding data will be overwritten.
   * Rejects if User is not logged in.
   */
  async set(recurrency: Required<Recurrency>): Promise<Recurrency> {
    const user = this.userService.currentUser()
    const timezone = this.settingsService.currentSettings().timezone

    if (user === null) return Promise.reject('User is null')
    
    await this.firestore.doc<RecurrencyData>(`users/${user.uid}/recurrencies/${recurrency.id}`).set(toRecurrencyData(recurrency, timezone))
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
    const user = this.userService.currentUser()
    if (user === null) return Promise.reject('User is null!')

    const idToDelete = this.currentRecurrencies().find(rec => rec.id === id) 
    if(idToDelete === undefined) return Promise.reject('Nothing to delete!')

    return this.firestore.doc<RecurrencyData>(`users/${user.uid}/recurrencies/${id}`).delete()
  }

  TEST() {
    setTimeout(() => {
      // const REC = {
      //   id: 'aaaa',
      //   title: 'REC',
      //   lastEvent: new Date(),
      //   periodNb: toPositiveInteger(99),
      //   periodUnit: toPeriodUnit('weeks')
      // }
      // const TIMEZONE = this.settingsService.currentSettings().timezone
      // this.save(REC)
      //   .then(res => console.log(res))
      //   .catch(err => console.log(err))

      // this.delete('aaa').then(_ => console.log('deleted!')).catch(_=>console.log('hey, nothing to delete!'))
      // this.delete('aaaa').then(_ => console.log('deleted!')).catch(_=>console.log('hey, nothing to delete!'))
    }, 2000);
  }

}