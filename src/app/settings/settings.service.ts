import { Injectable, inject } from "@angular/core";
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { Observable, map, of, switchMap } from "rxjs";

import { ISettings } from "../_interfaces/ISettings";
import { IUser } from "../_interfaces/IUser";
import { IStoreDocument } from "../_interfaces/IStoreDocument";

import { AuthService } from "../auth/auth.service";



@Injectable({providedIn: 'root'})
export class SettingsService {
  
  private _auth = inject(AuthService)
  private _firestore = inject(AngularFirestore)

  
  get$() {
    // return this._auth.user$.pipe(
    //   switchMap(usr => this._getSettingsFromUser(usr))
    // )
  }

  private _getSettingsFromUser(user: IUser | null): Observable<ISettings | null> {
    return this._firestore.doc<ISettings>(`users/${user?.id}/settings/0`).valueChanges().pipe(
      map(res => !!res ? res : null)
    )
  }

}


