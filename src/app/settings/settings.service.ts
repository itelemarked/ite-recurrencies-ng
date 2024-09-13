import { Injectable, Signal, computed, inject, signal } from "@angular/core";
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { toObservable, toSignal } from "@angular/core/rxjs-interop";
import { Observable, map, of, switchMap } from "rxjs";

import { ISettings } from "./settings.interface";
import { IUser } from "../_interfaces/IUser";
import { IStoreDocument } from "../_interfaces/IStoreDocument";

import { AuthService } from "../auth/auth.service";
import { StoreDocumentAngularfire } from "../_models/StoreDocumentAngularfire";
import { use } from "../_utils/global";



@Injectable({providedIn: 'root'})
export class SettingsService implements IStoreDocument<ISettings> {
  
  private _authService = inject(AuthService)

  // wrap the required storeClass into a store variable
  private storePath = computed(() => {
    const usr = this._authService.userSig()
    return !!usr ? `users/${usr.id()}/settings/0`: undefined
  })
  private storeClass = use(StoreDocumentAngularfire<ISettings>)
  private store = new this.storeClass(this.storePath)

  

  get$() {
    return this.store.get$()
  }




  private _firestore = inject(AngularFirestore)

  private _settings$ = toObservable(this._authService.userSig).pipe(
    switchMap(usr => this._getSettings$(usr))
  )

  settingsSig = toSignal<ISettings | null>(this._settings$, { initialValue: null })


  private _getSettings$(user: IUser | null): Observable<ISettings | null> {   
    return !!user
      ? this._firestore.doc<ISettings>(`users/${user.id()}/settings/0`).valueChanges().pipe(
          map(res => !!res ? res : null)
        )
      : of(null)
  }
}



// @Injectable({providedIn: 'root'})
// export class SettingsService {
//   private _firestore = inject(AngularFirestore)
//   private _authService = inject(AuthService)

//   private _settings$ = toObservable(this._authService.userSig).pipe(
//     switchMap(usr => this._getSettings$(usr))
//   )

//   settingsSig = toSignal<ISettings | null>(this._settings$, { initialValue: null })


//   private _getSettings$(user: User | null): Observable<ISettings | null> {   
//     return !!user
//       ? this._firestore.doc<ISettings>(`users/${user.id()}/settings/0`).valueChanges().pipe(
//           map(res => !!res ? res : null)
//         )
//       : of(null)
//   }
// }









// @Injectable({providedIn: 'root'})
// export class SettingsService implements IDocumentStore<ISettings> {

//   private _firestore = inject(AngularFirestore)
//   private _authService = inject(AuthService)

//   private _settings$ = toObservable(this._authService.userSig).pipe(
//     switchMap(usr => this._getSettings$(usr))
//   )

//   // settingsSig = toSignal<ISettings | null>(this._settings$, { initialValue: null })


//   private _getSettings$(user: User | null): Observable<ISettings | null> {   
//     return !!user
//       ? this._firestore.doc<ISettings>(`users/${user.id()}/settings/0`).valueChanges().pipe(
//           map(res => !!res ? res : null)
//         )
//       : of(null)
//   }

// }