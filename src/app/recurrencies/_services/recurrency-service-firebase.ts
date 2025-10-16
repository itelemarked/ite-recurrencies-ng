// import { inject, Injectable, Signal } from "@angular/core";
// import { toSignal } from "@angular/core/rxjs-interop";
// import { AngularFirestore } from "@angular/fire/compat/firestore";

// import { BehaviorSubject, catchError, map, Observable, of, throwError } from "rxjs";

// import { AuthServiceMock } from "@app/auth/auth-service-mock";

// import { SettingsServiceMock } from "@app/settings/_services/settings-service-mock";

// import { isRecurrency, Recurrency } from "../_types/Recurrency";
// import { isInterface } from "@app/_utils/validation/validation";


// @Injectable({providedIn: 'root'})
// export class RecurrencyServiceFirebase {

//   authService = inject(AuthServiceMock)
//   // settingsService = inject(SettingsServiceMock)
//   fbStore = inject(AngularFirestore)

//   private _recurrencies$: BehaviorSubject<Recurrency[] | undefined>
//   recurrencies$: Observable<Recurrency[] | undefined>
//   recurrencies: Signal<Recurrency[] | undefined>

//   constructor() {
//     // console.log('RecurrencyServiceFirebase constructor()')
//     this._recurrencies$ = new BehaviorSubject<Recurrency[] | undefined>([])
//     this.recurrencies$ = this._recurrencies$.asObservable()
//     this.recurrencies = toSignal(this._recurrencies$, {requireSync: true})

//     const user = this.authService.user()

//     const obs$ = this.fbStore.collection<any>(`users/${user!.uid}/recurrencies`).snapshotChanges().pipe(
//       map(res => {
//         return res.map(r => {
//           const data = {uid: r.payload.doc.id, ...r.payload.doc.data()}
//           if(!isRecurrency(data)) {
//             // how to show user that there were an arror in the data???
//             console.log('There was an error with the data...')
//             throw new Error(`There was an error with the data`)
//           }
//           return data
//         })
//       }),
//       catchError(_ => of([]))
//     )
//     obs$.subscribe(this._recurrencies$)

//     this._recurrencies$.subscribe(console.log)
//   }

// }