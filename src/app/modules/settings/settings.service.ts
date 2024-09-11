import { Injectable, inject } from "@angular/core";
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { AuthService } from "../auth/auth.service";
import { Observable, map, of, switchMap } from "rxjs";
import { User } from "../auth/User";
import { toObservable, toSignal } from "@angular/core/rxjs-interop";




export interface ISettings {
  timezone: string,
  locale: string
}


@Injectable({providedIn: 'root'})
export class SettingsService {

  private _firestore = inject(AngularFirestore)
  private _authService = inject(AuthService)

  private _settings$ = toObservable(this._authService.userSig).pipe(
    switchMap(usr => this._getSettings$(usr))
  )

  settingsSig = toSignal<ISettings | null>(this._settings$, { initialValue: null })


  private _getSettings$(user: User | null): Observable<ISettings | null> {   
    return !!user
      ? this._firestore.doc<ISettings>(`users/${user.id()}/settings/0`).valueChanges().pipe(
          map(res => !!res ? res : null)
        )
      : of(null)
  }

}