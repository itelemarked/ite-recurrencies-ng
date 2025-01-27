import { inject, Injectable } from "@angular/core"
import { BehaviorSubject, map, of, ReplaySubject, skip, switchMap, take } from "rxjs"

import { Settings, SettingsData } from "../types/Settings"
import { AuthService } from "./auth.service"
import { AngularFirestore } from "@angular/fire/compat/firestore"
import { TimezoneString, toTimezoneString } from "../types/TimezoneString"


const DEFAUTLT_SETTINGS: Settings = {
  timezone: 'UTC'
}

const fromData = (defaultSettings: Settings, data?: SettingsData): Settings => {
  const _data = { ...defaultSettings, ...data }
  return { timezone: toTimezoneString(_data.timezone) }
}

const toData = (settings: Settings): SettingsData => settings



@Injectable({providedIn: 'root'})
export class SettingsService {

  // DEPENDENCIES
  authService = inject(AuthService)
  firestore = inject(AngularFirestore)

  // PROPERTIES
  private _settings$$ = new BehaviorSubject<Settings>(DEFAUTLT_SETTINGS)
  public settings$$ = this._settings$$.asObservable()
  public currentSettings = DEFAUTLT_SETTINGS

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
          return fromData(DEFAUTLT_SETTINGS, settings)
        }))
      })
    )

    // listen to the first change only, then complete
    settingsFromUser$.pipe(take(1)).subscribe(_ => this._isLoading$$.next(true))
    // listen to the second change only, then complete
    settingsFromUser$.pipe(skip(1), take(1)).subscribe(_ => this._isLoading$$.next(false))
    
    // listen to all changes
    settingsFromUser$.subscribe(settings => {
      this.currentSettings = settings
      this._settings$$.next(settings)
    })
  }

  // TODO: avoid 'save' to fire 'settings$$' twice...
  save(settings: Settings): Promise<Settings> {
    const currentUser = this.authService.currentUser
    if(currentUser === null) return Promise.reject('user-is-null')
    this.firestore.doc<SettingsData>(`users/${currentUser.uid}/settings/data`).set(toData(settings))
    return Promise.resolve(settings)
  }

  TEST() {
    // this.settings$$.subscribe(val => console.log(val))
    // setTimeout(() => {
    //   // const timezone: TimezoneString = 'Indian/Mauritius'
    //   const timezone: TimezoneString = 'Europe/Zurich'
    //   const newSettings: Settings = {timezone}
    //   this.save(newSettings)
    //     .then((val) => console.log(val))
    //     .catch(err => console.log(err))
    // }, 3000);
  }
}