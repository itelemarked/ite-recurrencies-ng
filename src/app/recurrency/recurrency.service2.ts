import { inject, Injectable } from "@angular/core";
import { IRecurrency, IRecurrencyData, toRecurrency } from "../_interfaces/IRecurrency";
import { AngularFirestore, AngularFirestoreCollection } from "@angular/fire/compat/firestore";
import { AuthService } from "../auth/auth.service";
import { toObservable, toSignal } from "@angular/core/rxjs-interop";
import { IUser } from "../_interfaces/IUser";
import { combineLatest, firstValueFrom, from, map, mergeMap, of, switchMap, take } from "rxjs";
import { IStoreCollection2 } from "../_interfaces/IStoreCollection2";
import { AuthService2 } from "../auth/auth.service2";


@Injectable({providedIn: 'root'})
// export class RecurrencyService implements IStoreCollection<IRecurrency> {
export class RecurrencyService2 implements IStoreCollection2<IRecurrency> {

  private afStore = inject(AngularFirestore)
  private authService = inject(AuthService2)
  private ref$ = this.authService.user$.pipe(
    map(usr => this.afStore.collection<IRecurrency>(`users/${usr?.id}/recurrencies`))
  ) 

  TEST() {
    // this.authService.user$.subscribe(val => console.log(val))
    this.ref$
  }

  // PUBLIC

  getAll$() {
    return this.ref$.pipe(
      switchMap(ref => ref.snapshotChanges()),
      map(snaps => snaps.map(snap => {
        const id = snap.payload.doc.id
        const data = snap.payload.doc.data()
        return toRecurrency(data, id)
      }))
    )
  }

  get$(key: string) {
    return this.ref$.pipe(
      switchMap(ref => ref.doc(key).snapshotChanges()),
      map(snap => {
        if(snap.payload.exists) {
          const id = snap.payload.id
          const data = snap.payload.data()
          return toRecurrency(data, id)
        } else {
          return null
        }
      })
    )
  }

  add(value: IRecurrency): Promise<{key: string, value: IRecurrency}> {
    const observable$ = this.ref$.pipe(
      take(1),
      switchMap(ref => {
        return from(ref.add(value)).pipe(
          map(res => ({key: res.id, value}))
        )
      })
    )
    return firstValueFrom(observable$)
  }

  set(key: string, value: IRecurrency): Promise<{key: string, value: IRecurrency}> {
    const observable$ = this.ref$.pipe(
      take(1),
      switchMap(ref => {
        return from(ref.doc(key).set(value)).pipe(
          map(_ => ({key, value}))
        )
      })
    )
    return firstValueFrom(observable$)
  }

  remove(key: string): Promise<{key: string, value: IRecurrency} | null> {
    const user$ = this.authService.user$

    const getRecurrency$ = (user: IUser | null, key: string) => {
      if (user === null) return of(null)
      return this.afStore.collection<IRecurrency>(`users/${user.id}/recurrencies`).doc(key).snapshotChanges().pipe(
        take(1),
        map(res => {
          if (res.payload.exists) {
            return {key: res.payload.id, value: res.payload.data()}
          }
          return null
        })
      )
    }

    const getDelete$ = (usr: IUser | null, key: string) => {
      if(usr === null) return of(null)
      return from(this.afStore.collection(`users/${usr.id}/recurrencies`).doc(key).delete()).pipe(
        map(_ => null)
      )
    }

    const recurrency$ = user$.pipe(
      switchMap(usr => getRecurrency$(usr, key))
    )

    const delete$ = user$.pipe(
      switchMap(usr => getDelete$(usr, key))
    )

    const obs$ = recurrency$.pipe(
      switchMap(recurrency => {
        if (recurrency === null) return of(null)
        return delete$.pipe(
          map(_ => recurrency)
        )
      })
    )

    // const combined$ = user$.pipe(
    //   switchMap(usr => combineLatest([recurrency$, delete$])),
    //   map( ([recurrency, _]) => )
    // )

    return firstValueFrom(obs$)
  }


}

  // save(recurrency: IRecurrency) {
  //   // const add$ = this.ref$.pipe(
  //   //   switchMap(ref => {
  //   //     return from(ref.add(recurrency))
  //   //   }),
  //   //   map(res => {
  //   //     return {
  //   //       ...res.
  //   //       id: res.id,
  //   //     }
  //   //   })
  //   // )

  //   // if(recurrency.id === undefined) {

  //   // }
    
  //   const r = toRecurrency({
  //     title: 'aaa',
  //     lastEvent: '2020-01-01',
  //     periodNb: 99,
  //     periodUnit: 'days'
  //   }, 'aaa')
  //   return Promise.resolve({value: r, key: 'aaa'})
  // }
