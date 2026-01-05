import { inject, Injectable } from "@angular/core"
import { AngularFirestore } from "@angular/fire/compat/firestore"
import { map, Observable, of, startWith, switchMap } from "rxjs"
import { AuthFirebaseService } from "src/__Archives__/temp3/z-Archives/z_auth/auth-firebase.service"
import { User } from "src/__Archives__/temp3/z-Archives/z_auth/User"


@Injectable({providedIn: 'root'})
export class RecurrencyServiceFirebase {

  fbStore = inject(AngularFirestore)
  authService$ = inject(AuthFirebaseService)
  user$ = this.authService$.user$

  recurrenciesData$ = (user: User | null | undefined) => {
    if(!!user) {
      return of([])
    }
    return this.fbStore.collection<any>(`users/${user}/recurrencies`).snapshotChanges().pipe(
      startWith([]),
      map(datas => datas.map(data => ({
        uid: data.payload.doc.id,
        ...data.payload.doc.data()
      })))
    )
  }
  
  recurrencies$: Observable<any[]> = this.user$.pipe(
    switchMap(user => {
      if(user) {
        return this.fbStore.collection<any>(`users/${user}/recurrencies`).snapshotChanges().pipe(
          map(datas => datas.map(data => ({
            uid: data.payload.doc.id,
            ...data.payload.doc.data()
          })))
        )
      }
      return []
    }),
    switchMap(datas => {
      return of([])
    })
  )

}
