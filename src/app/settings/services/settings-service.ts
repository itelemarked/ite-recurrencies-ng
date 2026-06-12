import { Injectable } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { BehaviorSubject } from "rxjs";

import { TIMEZONE } from "../../../js/timezone-date/types/Timezone";
import { DATE_FORMAT } from "../../../js/timezone-date/types/DateFormat";
import { isSettings, Settings } from "../../_types/Settings";
import { SettingsServiceInterface } from "../../_types/SettingsServiceInterface";




// ------------- TYPES --------------------------------------------------
export const SETTINGS_ERROR = {
  fetched_data_wrong_type: 'fetched-data-wrong-type'
 } as const

export type SettingsError = typeof SETTINGS_ERROR[keyof typeof SETTINGS_ERROR]

type FetchResponse = 
  | { type: 'error', error: SettingsError } 
  | { type: 'success', data: Settings | null }



// ------------- SERVICE ------------------------------------------------
@Injectable({providedIn: 'root'})
export class SettingsService implements SettingsServiceInterface {

  // CONSTS ----------------------------------
  private DEFAULT_SETTINGS = {
    timezone: TIMEZONE.ZURICH,
    dateFormat: DATE_FORMAT.CH_DATE
  }

  private STORE_KEY = 'ite-recurrencies-ng-settings'

  // STATE ----------------------------------
  private state = {
    settings$: new BehaviorSubject<Settings>(this.DEFAULT_SETTINGS),
    loading$: new BehaviorSubject<boolean>(true),
    errors$: new BehaviorSubject<SettingsError[]>([])
  }
  
  // SELECTORS ----------------------------------
  settings$ = this.state.settings$.asObservable()
  settings = toSignal(this.state.settings$, {requireSync: true})

  loading$ = this.state.loading$.asObservable()
  loading = toSignal(this.state.loading$, {requireSync: true})

  errors$ = this.state.errors$.asObservable()
  errors = toSignal(this.state.errors$, {requireSync: true})

  // ACTIONS ----------------------------------
  constructor() {
    this._fetchData().then(response => {
      if(response.type === 'error') {
        this.state.errors$.next([...this.state.errors$.value, response.error])
        this.state.settings$.next(this.DEFAULT_SETTINGS)
      } else if (response.data !== null){
        this.state.settings$.next(response.data)
      }
      this.state.loading$.next(false)
    })
  }

  setDoc = async(settings: Settings): Promise<void> => {
    this._storeData(settings)
    this.state.settings$.next(settings)
    this.state.errors$.next([])
  }

  updateDoc = async(opts: Partial<Settings>): Promise<void> => {
    const currentSettings = this.state.settings$.value
    const settings: Settings = {
      timezone: opts.timezone ?? currentSettings.timezone,
      dateFormat: opts.dateFormat ?? currentSettings.dateFormat
    }
    
    this._storeData(settings)
    this.state.settings$.next(settings)
    this.state.errors$.next([])
  }

  deleteDoc = async(): Promise<void> => {
    this._clearData()
    this.state.settings$.next(this.DEFAULT_SETTINGS)
    this.state.errors$.next([])
  }

  // UTILS ----------------------------------
  private _fetchData = async(): Promise<FetchResponse> => {
    const dataString = localStorage.getItem(this.STORE_KEY)
    if(dataString === null) {
      return {type: 'success', data: null}
    }
    
    const data = JSON.parse(dataString)
    if(!isSettings(data)) {
      return {type: 'error', error: SETTINGS_ERROR.fetched_data_wrong_type}
    }

    return {type: 'success', data}
  }

  private _storeData = <T>(data: T) => {
    localStorage.setItem(this.STORE_KEY, JSON.stringify(data))
  }

  private _clearData = () => {
    localStorage.removeItem(this.STORE_KEY)
  }

}

