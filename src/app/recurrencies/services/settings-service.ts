import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { isSettings, Settings } from "../types/Settings";
import { toSignal } from "@angular/core/rxjs-interop";
import { TIMEZONE } from "../../../js/timezone-date/types/Timezone";
import { DATE_FORMAT } from "../../../js/timezone-date/types/DateFormat";
import { SettingsServiceInterface } from "../types/SettingsServiceInterface";


@Injectable({providedIn: 'root'})
export class SettingsService implements SettingsServiceInterface {

  private _settings$ = new BehaviorSubject<Settings>({
    timezone: TIMEZONE.ZURICH,
    dateFormat: DATE_FORMAT.CH_DATE
  })

  settings$ = this._settings$.asObservable()
  
  settings = toSignal(this.settings$, {requireSync: true})

  constructor() {
    const storedSettings = localStorage.getItem('ite-recurrencies-ng-settings')
    if(storedSettings !== null && isSettings(storedSettings)) {
      this._settings$.next(storedSettings)
    }
  }

}