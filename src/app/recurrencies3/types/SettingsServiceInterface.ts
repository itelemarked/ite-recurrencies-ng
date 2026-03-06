import { Observable } from "rxjs";
import { Settings } from "./Settings";
import { Signal } from "@angular/core";

export interface SettingsServiceInterface {
  settings$: Observable<Settings>,
  settings: Signal<Settings>,
  // update: (opts: Partial<Settings>) => Promise<void>,
  // deleteAll: () => Promise<void>
}