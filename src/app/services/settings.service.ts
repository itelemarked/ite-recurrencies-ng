import { computed, effect, Injectable, signal, WritableSignal } from "@angular/core"
import { Settings } from "../types/Settings"



@Injectable({providedIn: 'root'})
export class SettingsService {

  private _settings: WritableSignal<Settings | undefined> = signal(undefined)
  public settings = computed(() => this._settings())

  // constructor() {
  //   effect(() => {
  //     const user = this.auth
  //   })
  // }

  // getSettings(user: User): Promise<Settings | undefined> {
  //   get<Settings>(`users/${user}`)
  // } 

}

