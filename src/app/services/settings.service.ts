import { inject, Injectable } from "@angular/core"
import { BehaviorSubject, map, of, ReplaySubject, skip, switchMap, take } from "rxjs"

import { Settings, SettingsData } from "../types/Settings"
import { AuthService } from "./auth.service"
import { AngularFirestore } from "@angular/fire/compat/firestore"
import { toTimezoneString } from "../types/TimezoneString"


const DEFAUTLT_SETTINGS: Settings = {
  timezone: 'UTC'
}


@Injectable({providedIn: 'root'})
export class SettingsService {

  // DEPENDENCIES
  authService = inject(AuthService)
  firestore = inject(AngularFirestore)

  // PROPERTIES
  private _currentSettings = DEFAUTLT_SETTINGS
  public currentSettings = () => this._currentSettings
  private _settings$$ = new BehaviorSubject<Settings>(DEFAUTLT_SETTINGS)
  public settings$$ = this._settings$$.asObservable()

  private _isLoading$$ = new ReplaySubject<boolean>(1)
  public isLoading$$ = this._isLoading$$.asObservable()

  constructor() {

    const settingsFromUser$ = this.authService.user$$.pipe(
      switchMap(usr => {
        if(usr === null) {
          return of(DEFAUTLT_SETTINGS)
        }
        return this.firestore.doc<SettingsData>(`users/${usr.uid}/settings/data`).valueChanges().pipe(map(settings => {
          if(settings === undefined) return DEFAUTLT_SETTINGS
          const data = { ...DEFAUTLT_SETTINGS, ...settings }
          const timezone = toTimezoneString(data.timezone)
          return { timezone }
        }))
      })
    )

    // listen to the first change only, then complete
    settingsFromUser$.pipe(take(1)).subscribe(_ => this._isLoading$$.next(true))
    // listen to the second change only, then complete
    settingsFromUser$.pipe(skip(1), take(1)).subscribe(_ => this._isLoading$$.next(false))
    
    // listen to all changes
    settingsFromUser$.subscribe(settings => {
      this._currentSettings = settings
      this._settings$$.next(settings)
    })
  }

  // TODO: avoid 'save' to fire 'settings$$' twice...
  save(settings: Settings): Promise<Settings> {
    const currentUser = this.authService.currentUser()
    if(currentUser === null) return Promise.reject('user-is-null')
    this.firestore.doc<SettingsData>(`users/${currentUser.uid}/settings/data`).set(settings)
    return Promise.resolve(settings)
  }

  TEST() {}
}

