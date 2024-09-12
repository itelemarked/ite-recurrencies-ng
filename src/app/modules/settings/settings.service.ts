import { Injectable, Signal, computed, inject, signal } from "@angular/core";
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { AuthService } from "../auth/auth.service";
import { Observable, map, of, switchMap } from "rxjs";
import { User } from "../auth/User";
import { toObservable, toSignal } from "@angular/core/rxjs-interop";
import { ISettings } from "./settings.interface";
import { IDocumentStore } from "../../core/stores/store.interface";
import { FirebaseDocumentStore } from "../../core/stores/firebase-store.model";



@Injectable({providedIn: 'root'})
export class SettingsService implements IDocumentStore<ISettings> {
  
  private _authService = inject(AuthService)

  private storePath = computed(() => {
    const usr = this._authService.userSig()
    return !!usr ? `users/${usr.id()}/settings/0`: undefined
  })

  private store = new FirebaseDocumentStore<ISettings>(this.storePath)

  get$() {
    return this.store.get$()
  }




  private _firestore = inject(AngularFirestore)

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