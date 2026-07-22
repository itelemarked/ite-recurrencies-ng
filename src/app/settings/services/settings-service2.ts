import { inject, Injectable } from "@angular/core";
import { takeUntilDestroyed, toSignal } from "@angular/core/rxjs-interop";
import { BehaviorSubject, catchError, filter, ignoreElements, map, NEVER, Observable, of, switchMap, tap } from "rxjs";

import { isTimezone, TIMEZONE } from "../../../js/timezone-date/types/Timezone";
import { DATE_FORMAT, isDateFormat } from "../../../js/timezone-date/types/DateFormat";
import { isSettings, Settings } from "../../_types/Settings";
import { SettingsServiceInterface } from "../../_types/SettingsServiceInterface";
import { DocumentStoreInterface } from "../../_types/DocumentStoreInterface2";
import { StoreError } from "../../_types/StoreError";
import { Identifiable } from "../../_types/Identifiable";
import { User } from "../../_types/User";
import { doc, onSnapshot } from "firebase/firestore";
import { FirebaseService } from "../../_core/firebase-service";
import { AuthService } from "../../auth/services/auth-service";
import { log } from "../../../js/errors/rxjs-operator-log";
import { isInterface } from "../../../js/types/valid-type";
import { AuthError } from "../../_types/AuthError";


// dev only
const USER_A: User = {
  uid: '0yuA0RLZFJdbRKtVSfW4y5HSQMq1',
  email: 'aaa@aaa.com'
}

@Injectable({providedIn: 'root'})
export class SettingsService implements DocumentStoreInterface<Settings> {

  private fbStore = inject(FirebaseService).firestore
  private authService = inject(AuthService)

  // CONST
  protected docRef = (user: User) => doc(this.fbStore, `users/${user.uid}/settings/SETTINGS_UID`)
  protected isDocType = isSettings

  /** 
   * This should never error, otherwise the observable would end, which would break the listener... 
   * but we want to be able to retreive potential valid data later on! --> the error is returned iso thrown.
   * - The 'complete' callback is removed (acc onSnapshot documentation, it never completes.) 
   * - The 'error' callback is converted in 'next' as an 'Error'.
   */
  private docChangeForUser$ = (user: User) => {
    return new Observable<Identifiable<Settings> | null | Error>(subscriber => {
      const unsubscribe = onSnapshot(this.docRef(user), {
        next: (doc) => {
          const data = doc.data()
          const uid = doc.id
          if(data === undefined) {
            subscriber.next(null)
          }
          else if(isSettings(data)) {
            subscriber.next({...data, uid})
          }
          else {
            subscriber.next(new StoreError('invalid-data', {cause: {...data, uid}}))
          }
        },
        // should never 'error' nor 'complete'... otherwise the listener would end!
        error: (err) => subscriber.next(new StoreError('unknown-store-error', err.code)),
      })
      subscriber.add(() => unsubscribe())
    })
  }


  // STATE
  private state = {
    doc$: new BehaviorSubject<Identifiable<Settings> | null | undefined>(undefined),
    isLoading$: new BehaviorSubject<boolean>(true),
    error$: new BehaviorSubject<StoreError | null>(null)
  }

  // ACTIONS
  private userChange$ = this.authService.user$

  private userStartsLoading$ = this.authService.isLoading$.pipe(
    filter(val => val === true)
  )

  private docChangeSuccess$ = this.userChange$.pipe(
    switchMap(usr => !!usr 
      ? this.docChangeForUser$(usr).pipe(
          filter(val => val === null || this.isDocType(val))
        )
      : NEVER
    )
  )

  private docChangeFailure$ = this.userChange$.pipe(
    switchMap(usr => !!usr 
      ? this.docChangeForUser$(usr).pipe(
          filter(val => val instanceof StoreError)
        )
      : NEVER
    )
  )

  private setRequest$: any
  private setFailure$: any
  private updateRequest$: any
  private updateFailure$: any
  private clearRequest$: any
  private clearFailure$: any

  constructor() {
    // const unsub = onSnapshot(this.docRef(USER_A), (doc) => {
    //   console.log("Current data: ", doc.data());
    // })

    // this.docRealtimeChange$(USER_A).pipe(
    //   log('docRealtimeChange$')
    // ).subscribe()

    // REDUCERS

    this.userStartsLoading$.pipe(takeUntilDestroyed()).subscribe((_) => {
      this.state.isLoading$.next(true)
    })

    this.docChangeSuccess$.pipe(takeUntilDestroyed()).subscribe((doc) => {
      this.state.isLoading$.next(false)
      this.state.error$.next(null)
      this.state.doc$.next(doc)
    })
    
    this.docChangeFailure$.pipe(takeUntilDestroyed()).subscribe((error) => {
      this.state.isLoading$.next(false)
      this.state.error$.next(error)
      this.state.doc$.next(null)
    })

    // this.docRealtimeChange$(USER_A).subscribe({
    //   next: (val) => console.log('next', val),
    //   error: (err) => console.log('error', err),
    //   complete: () => console.log('completes'),
    // })
  }

  
  // SELECTORS
  readonly doc$ = this.state.doc$.asObservable()
  readonly doc = toSignal(this.state.doc$, {requireSync: true})

  readonly isLoading$ = this.state.isLoading$.asObservable()
  readonly isLoading = toSignal(this.state.isLoading$, {requireSync: true})

  readonly error$ = this.state.error$.asObservable()
  readonly error = toSignal(this.state.error$, {requireSync: true})

  async set(item: Settings, uid?: string) {}

	async update(opts: Partial<Settings>) {}

	async clear() {}
}

