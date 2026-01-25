import { computed, inject, Injectable, Signal } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { AngularFirestore } from "@angular/fire/compat/firestore";

import { BehaviorSubject, distinctUntilChanged, filter, map, Observable, of, switchMap, tap } from "rxjs";

import { Auth5Service } from "./auth5.service";

import { Settings } from "@app/types/Settings.type";
import { isTimezone, Timezone } from "@app/types/Timezone.enum";
import { DateFormat, isDateFormat } from "@app/types/DateFormat.enum";
import { DataRequest, DataRequestDataFound, DataRequestNoDataFound } from "@app/types/DataRequest.type";
import { User } from "@app/types/User.type";
import { isInterface } from "@app/utils/validation/validation";


/**
 * TODO: 
 * - Errors handling
 */


interface SettingsServiceInterface {
  // /**
  //  * Observable and Signal which returns:
  //  * - current Settings (and the DEFAULT one if no data is present on the server)
  //  * - undefined if the request is pending (loading)
  //  * 
  //  * Settings data on the server consists always of NOTHING or EVERYTHING (-> if at least one property is not the default one, all other props, also the default ones, will be saved as well!)
  //  * Since settings depends on the current user, a new fetch must be done when changing user, and therefore the value must be set to 'undefined' during the fetch.
  //  */
  // settings$: Observable<DataRequest<Settings>>
  // settings: Signal<DataRequest<Settings>>
  // /**
  //  * Partial settings properties or the whole settings object can be passed as argument.
  //  * Settings data are updated, set (if not present yet) or deleted (in case they are the same as DEFAULT) on the server.
  //  */
  // save: (options: Partial<Settings>) => Promise<void>
  // /**
  //  * Settings data are delete on the server.
  //  * Settings are set to DEFAULT in the settingsService.
  //  */
  // reset: () => Promise<void>
}




@Injectable({providedIn: 'root'})
export class Settings5Service 
// implements SettingsServiceInterface 
{

  private authService = inject(Auth5Service)
  private fbStore = inject(AngularFirestore)

  private DEFAULT_VALUES: Settings = {
    timezone: Timezone.PLATFORM_DEFINED,
    dateFormat: DateFormat.PLATFORM_DEFINED
  }


  private _settings$ = new BehaviorSubject<Settings | null | undefined>(undefined)

  /**
   * emits when the user changes or when the settings data changes on the backend.
   */
  private _settingsChange$ = this.authService.user$.pipe(
    switchMap((usr: User | null | undefined): Observable<Settings | null | undefined> => {
      if(usr === undefined) return of(undefined)
      if(usr === null) return of(null)
      
      // returns any data or undefined
      const snapshot$ = this.fbStore.doc(`users/${usr.uid}/settings/SETTINGS_UID`).snapshotChanges()
      const settings$ = snapshot$.pipe(
        map(snap => snap.payload.data()),
        map((data: unknown | undefined): Settings | null => {
          if(data === undefined) {
            return null
          }
          if(!isInterface<Settings>({
            dateFormat: [isDateFormat],
            timezone: [isTimezone]
          })(data)) throw new Error(`Invalid settings data: ${data}`)
          return data
        })
      )
      return settings$
    })
  )

  /**
   * Public properties, depending directly of '_settings$', with the difference that 'null' value is replaced by the default values (also if 'user' is 'null'!)
   */
  settings$ = this._settings$.asObservable().pipe(
    map(res => res === null ? this.DEFAULT_VALUES : res)
  )
  settings = toSignal(this.settings$, {requireSync: true})
  isLoading = computed(() => this.settings() === undefined)

  constructor() {
    this._settingsChange$.subscribe(val => this._settings$.next(val))
  }

  // save(options: Partial<Settings>): Promise<void> {
  //   const currentUser = this.authService.user()
  //   this.fbStore.doc(`users/${usr.value.uid}/settings/SETTINGS_UID`)
  // }

}


