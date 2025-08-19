import { Injectable, Signal } from "@angular/core";
import { SettingsServiceInterface } from "../_types/SettingsServiceInterface";
import { Settings } from "../_types/Settings";
import { DateFormat } from "../_types/DateFormat";
import { Timezone } from "../_types/Timezone";
import { BehaviorSubject, Observable } from "rxjs";
import { toSignal } from "@angular/core/rxjs-interop";



const DEFAULT_SETTINGS: Settings = {
  dateFormat: DateFormat.PLATFORM_DEFINED,
  timezone: Timezone.PLATFORM_DEFINED
}


@Injectable({providedIn: 'root'})
export class SettingsServiceMock implements SettingsServiceInterface {
  private _settings$: BehaviorSubject<Settings | undefined>
  settings$: Observable<Settings | undefined>
  settings: Signal<Settings | undefined>

  constructor() {
    this._settings$ = new BehaviorSubject<Settings | undefined>(DEFAULT_SETTINGS)
    this.settings$ = this._settings$.asObservable()
    this.settings = toSignal(this._settings$, {requireSync: true})
  }

  save(options: Partial<Settings>): Promise<void> {
    throw new Error(`save() not implemented yet...`)
  }

  reset(): Promise<void> {
    throw new Error(`reset() not implemented yet...`)
  }
}