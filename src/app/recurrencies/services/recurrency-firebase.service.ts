import { inject, Injectable, Signal } from "@angular/core"
import { toSignal } from "@angular/core/rxjs-interop"
import { AngularFirestore } from "@angular/fire/compat/firestore"
import { BehaviorSubject, map, Observable } from "rxjs"

import { Identifiable } from "@app/_types/Identifiable"
import { Recurrency } from "@app/_types/Recurrency"





@Injectable({providedIn: 'root'})
export class RecurrencyFirebaseService {

  fbStore = inject(AngularFirestore)

  // TODO: replace with authService user!!
  private userId = '0yuA0RLZFJdbRKtVSfW4y5HSQMq1'
  
  private _data$ = new BehaviorSubject<Identifiable<Recurrency>[]>([])

  constructor() {

    this.fbStore.collection<any>(`users/${this.userId}/recurrencies`).snapshotChanges().pipe(
      map(collSnap => {
        if(collSnap.length === 0) {
          return []
        }

        // if(!collSnap.every(docSnap => isRecurrency(docSnap.payload.doc.data()))) {
        //   throw new Error(`at least one of the data received is not of type 'Recurrency'...`) 
        // }

        return collSnap.map(docSnap => {
          const uid = docSnap.payload.doc.id
          const data = docSnap.payload.doc.data()
          return {uid, ...data}
        })
      })
    ).subscribe(this._data$)

  }

  get$() {
    return this._data$.asObservable()
  }

  get() {
    return toSignal(this._data$.asObservable(), {requireSync: true})
  }

}