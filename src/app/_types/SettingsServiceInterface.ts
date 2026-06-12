import { Observable } from "rxjs";
import { Settings } from "./Settings";
import { Signal } from "@angular/core";
import { SettingsError } from "../settings/services/settings-service";

export interface SettingsServiceInterface {
  settings$: Observable<Settings>,
  settings: Signal<Settings>,
  loading$: Observable<boolean>,
  loading: Signal<boolean>,
  errors$: Observable<SettingsError[]>,
  errors: Signal<SettingsError[]>,
  updateDoc: (opts: Partial<Settings>) => Promise<void>,
  setDoc: (settings: Settings) => Promise<void>
  deleteDoc: () => Promise<void>
}
