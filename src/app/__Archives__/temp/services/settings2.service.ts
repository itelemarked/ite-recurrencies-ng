import { computed, inject, Injectable, signal, Signal } from "@angular/core";
import { Settings, toSettings } from "../__Archives__/temp/types/Settings";
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { AuthService } from "./auth.service";
import { User } from "../__Archives__/temp/types/User";
import { map } from "rxjs";


type IStore<T> = {
  get: () => Signal<T | null | undefined>
  set: (val: T) => Promise<T | undefined>
}

@Injectable({providedIn: 'root'})
export class SettingsService implements IStore<Settings> {

  // DEPENDENCIES
  private fs = inject(AngularFirestore)
  private auth = inject(AuthService)

  private _settingsSig = signal<Settings | null | undefined>(undefined)

  constructor() {
    
  }

  get() {
    return computed(() => this._settingsSig()) 
  }

  set(val: Settings) {
    return Promise.resolve(toSettings({timezone: 'UTC'}))
  }

  // private fetchSettings(user: User): Signal<Settings | undefined> {
  //   const settings$ = this.fs.doc(`users/${user.uid}/settings/data`).snapshotChanges().pipe(
  //     map(res => toSettings(res.payload.data))
  //   )
  // }

}