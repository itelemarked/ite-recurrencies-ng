import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { isSettings, Settings } from "./settings.type";
import { TIMEZONE } from "src/js/timezone-date/types/Timezone";
import { DATE_FORMAT } from "src/js/timezone-date/types/DateFormat";
import { toSignal } from "@angular/core/rxjs-interop";

@Injectable({providedIn: 'root'})
export class SettingsService {

  private _settings$ = new BehaviorSubject<Settings>({
    timezone: TIMEZONE.ZURICH,
    dateFormat: DATE_FORMAT.CH
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