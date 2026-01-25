import { Signal } from "@angular/core"
import { Observable } from "rxjs"
import { SettingsState } from "./SettingsState"
import { Settings } from "./Settings"

export interface SettingsServiceInterface {
    state$: Observable<SettingsState>
    state: Signal<SettingsState>
    update: (opts: Partial<Settings>) => Promise<void>
}