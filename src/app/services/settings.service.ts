import { Injectable, Signal } from "@angular/core";
import { DateFormat, isDateFormat } from "../types/DateFormat.enum";
import { BehaviorSubject, distinctUntilChanged, map, Observable, tap } from "rxjs";
import { isTimezone, Timezone } from "../types/Timezone.enum";
import { toSignal } from "@angular/core/rxjs-interop";
import { CustomTypeError } from "@app/utils/errors";



/********** MOCK *********/


let MOCK_DATA: any = {
  timezone: Timezone.INDIAN_MAURITIUS,
  dateFormat: DateFormat.US
}

// let MOCK_DATA: any = null

// let MOCK_DATA: any = {
//   timezone: Timezone.INDIAN_MAURITIUS,
// }

async function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(() => resolve(), ms))
}

async function fetchData() {
  await delay(700)
  return MOCK_DATA === undefined ? null : MOCK_DATA
}

async function saveData(data: any) {
  await delay(100)
  MOCK_DATA = data
}

/********** MOCK *********/



type Settings = {
  timezone: Timezone,
  dateFormat: DateFormat
}




interface SettingsServiceInterface {
  settings$: Observable<Settings | undefined>
  settings: Signal<Settings | undefined>
  dateFormat$: Observable<DateFormat | undefined>
  dateFormat: Signal<DateFormat | undefined>
  timezone$: Observable<Timezone | undefined>
  timezone: Signal<Timezone | undefined>
  update: (options: Settings) => Promise<void>
  // delete: (props?: (keyof Settings)[]) => Promise<void>
}


@Injectable({providedIn: 'root'})
export class SettingsService implements SettingsServiceInterface {

  private DEFAULT_VALUES: Settings = {
    timezone: Timezone.PLATFORM_DEFINED,
    dateFormat: DateFormat.PLATFORM_DEFINED
  }

  private _settings$ = new BehaviorSubject<Settings | undefined>(undefined)
  settings$ = this._settings$.asObservable().pipe(
    distinctUntilChanged((prev, curr) => prev?.timezone === curr?.timezone && prev?.dateFormat === curr?.dateFormat)
  )
  settings = toSignal(this.settings$, {requireSync: true})

  dateFormat$ = this.fromProp<DateFormat>(this.settings$, 'dateFormat', DateFormat.PLATFORM_DEFINED)
  dateFormat = toSignal(this.dateFormat$, {requireSync: true})

  timezone$ = this.fromProp<Timezone>(this.settings$, 'timezone', Timezone.PLATFORM_DEFINED)
  timezone = toSignal(this.timezone$, {requireSync: true})

  constructor() {
    fetchData().then(data => {
      this._settings$.next(this.fromData(data))
    })
  }

  async update(options: Settings) {
    const newSettings = {...this._settings$.value, ...options}
    await saveData(this.toData(newSettings))
    this._settings$.next(newSettings)
  }

  private fromProp<R, T extends Record<string, any> = any>(obs: Observable<T | null | undefined>, prop: keyof T, nullValue: R) {
    return obs.pipe(
      map(val => {
        switch(val) {
          case undefined: return undefined
          case null: return nullValue
          default: return val[prop]  === undefined ? nullValue : val[prop] as R
        }
      }),
      distinctUntilChanged()
    )
  }

  private fromData(data: any): Settings {
    if(data === null || data === undefined) return this.DEFAULT_VALUES
    
    const getDateFormat = (val: any) => {
      if(!isDateFormat(val)) throw new CustomTypeError(`Invalid dateFormat data: ${val}`)
      return val
    }

    const getTimezone = (val: string | null) => {
      if(!isTimezone(val)) throw new CustomTypeError(`Invalid timezone data: ${val}`)
      return val
    }

    const settings: Settings = {
      dateFormat: getDateFormat(data.dateFormat),
      timezone: getTimezone(data.timezone)
    }

    return settings
  }

  private toData(data: Settings): Settings | null {
    const isDefaultObject = data.dateFormat === this.DEFAULT_VALUES.dateFormat && data.timezone === this.DEFAULT_VALUES.timezone
    return isDefaultObject ? null : data
  }

}
