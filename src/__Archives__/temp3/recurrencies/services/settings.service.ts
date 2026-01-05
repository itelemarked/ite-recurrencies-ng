import { inject, Injectable, signal } from "@angular/core";
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { catchError, map, Observable, of, switchMap } from "rxjs";
import { SettingsState } from "../types/SettingsState";
import { Settings } from "../types/Settings";
import { isTimezone } from "../types/Timezone";
import { isDateFormat } from "../types/DateFormat";
import { SettingsServiceInterface } from "../types/SettingsServiceInterface";
import { isInterface } from "../utils/validation";
import { AuthService } from "./auth.service";
import { toSignal } from "@angular/core/rxjs-interop";

@Injectable({providedIn: 'root'})
export class SettingsService 
implements SettingsServiceInterface
{

  private DEFAULT_SETTINGS: Settings = {
    timezone: 'Europe/Zurich',
    dateFormat: 'CH'
  }

  private fbStore = inject(AngularFirestore)

  private authService = inject(AuthService)

  state$: Observable<SettingsState> = this.authService.state$.pipe(
    switchMap(authState => {
      switch(authState.state) {
        case 'loading': {
          return of({ state: 'loading' } as SettingsState)
        }
        case 'error': {
          return of({ state: 'error', message: `AuthState emits an error...: ${authState.message}` } as SettingsState)
        }
        case 'success': {
          if(authState.data === null) {
            return of({ state: 'success', data: this.DEFAULT_SETTINGS } as SettingsState)
          }

          return this.fbStore.doc<any>(`users/${authState.data.uid}/settings/SETTINGS_UID`).valueChanges().pipe(
            catchError(err => {
              return of({ state: 'error', message: err.message } as SettingsState)
            }),
            map(data => {
              const isSettings = isInterface({
                timezone: [isTimezone],
                dateFormat: [isDateFormat]
              })

              if(!isSettings(data)) {
                return { state: 'error', message: `Settings data fetched are not valid...: ${data}`  } as SettingsState
              }
              return { state: 'success', data } as SettingsState
            })
          )
        }
      }
    })
  )

  state = toSignal(this.state$, {requireSync: true})

  // TODO
  update(opts: Partial<Settings>) {
    return Promise.resolve()
  }

}