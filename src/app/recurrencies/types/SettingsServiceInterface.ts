import { Observable } from "rxjs";
import { Settings } from "./Settings";
import { Signal } from "@angular/core";

export interface SettingsServiceInterface {
  // settings$: Observable<Settings>,
  settings: Signal<Settings>,
  updateDoc: (opts: Partial<Settings>) => Promise<void>,
  setDoc: (settings: Settings) => Promise<void>
  deleteDoc: () => Promise<void>
}