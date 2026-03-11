import { Injectable, signal } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { isSettings, Settings } from "../types/Settings";
import { Timezone, TIMEZONE } from "../../../js/timezone-date/types/Timezone";
import { DATE_FORMAT, DateFormat } from "../../../js/timezone-date/types/DateFormat";
import { SettingsServiceInterface } from "../types/SettingsServiceInterface";


@Injectable({providedIn: 'root'})
export class SettingsService implements SettingsServiceInterface {

  DEFAULT_SETTINGS = {
    timezone: TIMEZONE.ZURICH,
    dateFormat: DATE_FORMAT.ISO
  }

  STORE_KEY = 'ite-recurrencies-ng-settings'
  
  settings = signal<Settings>(this.DEFAULT_SETTINGS)

  constructor() {}

  getDoc = async(): Promise<Settings | null> => {
    const storedSettingsOrNull = await this._localStorageGet()
    return Promise.resolve(storedSettingsOrNull === null ? this.DEFAULT_SETTINGS : storedSettingsOrNull)
  }

  setDoc = (settings: Settings): Promise<void> => {
    localStorage.setItem(this.STORE_KEY, JSON.stringify(settings))
    this.settings.set(settings)
    return Promise.resolve()
  }

  updateDoc = async(opts: Partial<Settings>): Promise<void> => {
    const definedOptions = this._getNonUndefinedOptions(opts)
    const storedSettings = await this.getDoc()
    const defaultSettings = this.DEFAULT_SETTINGS
    
    const newSettings = storedSettings === null 
      ? {...defaultSettings, ...definedOptions}
      : {...storedSettings, ...definedOptions}
    await this.setDoc(newSettings)
    return Promise.resolve()
  }

  deleteDoc = (): Promise<void> => {
    localStorage.removeItem(this.STORE_KEY)
    this.settings.set(this.DEFAULT_SETTINGS)
    return Promise.resolve()
  }

  _localStorageGet = (): Promise<Settings | null> => {
    const storedString = localStorage.getItem(this.STORE_KEY)
    if(storedString === null) {
      return Promise.resolve(null)
    }
    
    const storedSettings = JSON.parse(storedString)
    if(!isSettings(storedSettings)) {
      return Promise.resolve(null)
    }

    return Promise.resolve(storedSettings)
  }

  _getNonUndefinedOptions = (opts: Partial<Settings>) => {
    const validOptions = Object.entries(opts).reduce((acc, [key, value]) => {
      if(value === undefined) return acc
      return {...acc, [key]: value}
    }, {})
    return validOptions
  }

}