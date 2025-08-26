import { Signal } from "@angular/core"

import { Observable } from "rxjs"

import { Settings } from "./Settings"

export type SettingsServiceInterface = {
  /**
     * Observable and Signal which returns:
     * - current Settings (and the DEFAULT one if no data is present on the server)
     *
     * Settings data on the server consists always of NOTHING or EVERYTHING (-> if at least one property is not the default one, all other props, also the default ones, will be saved as well!)
     * Since settings depends on the current user, a new fetch must be done when changing user, and therefore the value must be set to 'loading' during the fetch.
     */
    settings$: Observable<Settings | undefined>;
    settings: Signal<Settings | undefined>;
    /**
     * Partial settings properties or the whole settings object can be passed as argument.
     * Settings data are updated, set (if not present yet) or deleted (in case they are the same as DEFAULT) on the server.
     * Settings are set accordingly in the settingsService
     */
    save: (options: Partial<Settings>) => Promise<void>;
    /**
     * Settings data are delete on the server.
     * Settings are set to DEFAULT in the settingsService.
     */
    reset: () => Promise<void>;
}