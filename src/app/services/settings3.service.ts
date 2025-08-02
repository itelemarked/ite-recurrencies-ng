import { inject, Injectable, Signal } from "@angular/core";
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { toSignal } from "@angular/core/rxjs-interop";

import { BehaviorSubject, distinctUntilChanged, filter, map, Observable, of, switchMap, tap } from "rxjs";

import { Auth3Service } from "./auth3.service";

import { Settings } from "@app/types/Settings.type";
import { isTimezone, Timezone } from "@app/types/Timezone.enum";
import { DateFormat, isDateFormat } from "@app/types/DateFormat.enum";
import { DataRequest, DataRequestDataFound, DataRequestNoDataFound } from "@app/types/DataRequest.type";
import { User } from "@app/types/User.type";
import { isInterface } from "@app/utils/validation/validation";











// interface SettingsServiceInterface {
//   /**
//    * Observable and Signal which returns:
//    * - current Settings (and the DEFAULT one if no data is present on the server)
//    * - undefined if the request is pending (loading)
//    * 
//    * Settings data on the server consists always of NOTHING or EVERYTHING (-> if at least one property is not the default one, all other props, also the default ones, will be saved as well!)
//    * Since settings depends on the current user, a new fetch must be done when changing user, and therefore the value must be set to 'undefined' during the fetch.
//    */
//   settings$: Observable<Settings | undefined>
//   settings: Signal<Settings | undefined>
//   /**
//    * Partial settings properties or the whole settings object can be passed as argument.
//    * Settings data are updated, set (if not present yet) or deleted (in case they are the same as DEFAULT) on the server.
//    * Settings are set accordingly in the settingsService
//    */
//   save: (options: Partial<Settings>) => Promise<void>
//   /**
//    * Settings data are delete on the server.
//    * Settings are set to DEFAULT in the settingsService.
//    */
//   reset: () => Promise<void>
// }




@Injectable({providedIn: 'root'})
export class Settings3Service {

  private authService = inject(Auth3Service)
  private fbStore = inject(AngularFirestore)

  private DEFAULT_VALUES: Settings = {
    timezone: Timezone.PLATFORM_DEFINED,
    dateFormat: DateFormat.PLATFORM_DEFINED
  }


  private _currentSettings$ = new BehaviorSubject<DataRequest<Settings>>({state: 'loading'})

  /**
   * emits when the settings changes on the firebase backend
   */
  settingsChange$ = this.authService.userChange$.pipe(
    switchMap((usr: DataRequestDataFound<User> | DataRequestNoDataFound): Observable<DataRequestDataFound<Settings> | DataRequestNoDataFound> => {
      if(usr.state === 'data-not-found') return of({state: 'data-not-found'})

      // returns any data or undefined
      const snapshot$ = this.fbStore.doc(`users/${usr.value.uid}/settings/SETTINGS_UID`).snapshotChanges()
      const settings$ = snapshot$.pipe(
        map(snap => snap.payload.data()),
        map((data: unknown | undefined): DataRequestDataFound<Settings> | DataRequestNoDataFound => {
          if(data === undefined) {
            return {state: 'data-not-found'}
          }
          if(!isInterface<Settings>({
            dateFormat: [isDateFormat],
            timezone: [isTimezone]
          })(data)) throw new Error(`Invalid settings data: ${data}`)
          return {state: 'data-found', value: data}
        })
      )

      return settings$
    })
  )

  /**
   * Public properties, depending directly of '_settings$'
   */
  currentSettings$ = this._currentSettings$.asObservable()
  // .pipe(
  //   distinctUntilChanged((prev, curr) => prev?.timezone === curr?.timezone && prev?.dateFormat === curr?.dateFormat)
  // )
  currentSettings = toSignal(this.currentSettings$, {requireSync: true})

  constructor() {
    this.authService.currentUser$.pipe(
      filter(usr => usr.state === 'loading')
    ).subscribe(_ => this._currentSettings$.next({state: 'loading'}))

    this.settingsChange$.subscribe(res => this._currentSettings$.next(res))
  }

}


