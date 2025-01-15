import { Injectable } from "@angular/core"
import { BehaviorSubject } from "rxjs"

import { Settings, toSettings } from "../types/Settings"


@Injectable({providedIn: 'root'})
export class SettingsService {

  // PROPERTIES
  private _settings$$ = new BehaviorSubject<Settings>(toSettings())
  public settings$$ = this._settings$$.asObservable()
  public currentSettings = () => this._settings$$.value

  constructor() {}

}