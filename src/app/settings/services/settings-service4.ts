import { inject, Injectable } from "@angular/core";
import { takeUntilDestroyed, toSignal } from "@angular/core/rxjs-interop";
import { BehaviorSubject, filter, skip } from "rxjs";

import { doc, onSnapshot } from "firebase/firestore";

import { FirebaseService } from "../../_core/firebase-service";

import { AuthService } from "../../auth/services/auth-service4";

import { DocumentStoreInterface } from "../../_types/DocumentStoreInterface2";
import { isSettings, Settings } from "../../_types/Settings";
import { StoreError } from "../../_types/StoreError";
import { Identifiable } from "../../_types/Identifiable";
import { User } from "../../_types/User";
import { Unsubscribe } from "firebase/firestore";



@Injectable({providedIn: 'root'})
export class SettingsService implements DocumentStoreInterface<Settings> {

  private fbStore = inject(FirebaseService).firestore
  private authService = inject(AuthService)

  private docRef = (user: User) => doc(this.fbStore,`users/${user.uid}/settings/SETTINGS_UID`)

  // STATE
  private state = {
    doc$: new BehaviorSubject<Identifiable<Settings> | null | undefined>(undefined),
    isLoading$: new BehaviorSubject<boolean>(true),
    error$: new BehaviorSubject<StoreError | null>(null),
    unsubscribeToDocChanges: () => {}
  }


  constructor() {
    this.authService.user$.pipe(
      takeUntilDestroyed(),
      filter(val => val !== undefined) // skip initial loading
    ).subscribe(val => this.userChanged(val))

    this.authService.isLoading$.pipe(
      takeUntilDestroyed(),
      filter(val => val === true),
      skip(1) // skip initial loading
    ).subscribe((_) => this.userLoadingStarts())
  }


  // ACTIONS

  // triggered when the auth.user change effectively, and doesn't trigger on initial loading of the auth.user
  private userChanged(user: User | null) {
    this.state.unsubscribeToDocChanges()

    if(!!user) {
      this.setStateOperationStarts()
      this.state.unsubscribeToDocChanges = onSnapshot(this.docRef(user), {
        next: (snap) => {
          const uid = snap.id
          const data = snap.data()

          if(data === undefined) {
            this.setStateOperationSucceeded()
            this.setStateDoc(null)
          }
          else if(isSettings(data)) {
            this.setStateOperationSucceeded()
            this.setStateDoc({uid, ...data})
          }
          else {
            this.setStateOperationFailed(new StoreError('invalid-data'))
          }
        },
        error: (err) => {
          this.setStateOperationFailed(new StoreError('unknown-store-error', err.code))
        }
      })
    }
  }

  // triggered on a authService action (loginRequest, signupRequest, logoutRequest). 
  // So it listen from the second auth.isLoading (true), since the first one happend during initial load.
  private userLoadingStarts() {}

  // private userChange(user: User | null | undefined) {
    // this.state.docChangeListenerUnsubscribe()
    // this.state.isLoading$.next(true)
    // this.state.error$.next(null)

    // if(user !== null && user !== undefined) {
    //   this.state.docChangeListenerUnsubscribe = onSnapshot(this.docRef(user), {
    //     next: (doc) => {
    //       const data = doc.data()
    //       const uid = doc.id
    //       if(data === undefined) {
    //         this.docRealtimeChangeSuccess(null)
    //       }
    //       else if(isSettings(data)) {
    //         this.docRealtimeChangeSuccess({uid, ...data})
    //       }
    //       else {
    //         this.docRealtimeChangeFailure(new StoreError('invalid-data', {cause: {...data, uid}}))
    //       }
    //     },
    //     error: (err) => this.docRealtimeChangeFailure(new StoreError('unknown-store-error', err.code))
    //   })
    // }
    // else {
    //   this.state.isLoading$.next(false)
    //   this.state.doc$.next(null)
    // }
  // }
  
  // private docRealtimeChangeSuccess(data: Identifiable<Settings> | null) {
  //   this.state.isLoading$.next(false)
  //   this.state.error$.next(null)
  //   this.state.doc$.next(data)
  // }
  
  // private docRealtimeChangeFailure(error: StoreError) {
  //   this.state.isLoading$.next(false),
  //   this.state.error$.next(error)
  //   this.state.doc$.next(null)
  // }

  // private userStartsLoading() {
  //   this.state.isLoading$.next(true)
  //   this.state.error$.next(null)
  // }

  // private setRequest(item: Settings) {
  //   this.state.isLoading$.next(true)
  //   this.state.error$.next(null)

  //   const user = this.authService.user()
  //   if(!!user) {
  //     setDoc(this.docRef(user), item)
  //       .then((_) => this.operationSucceeded())
  //       .catch(err => {
  //         const error = assertError(err)
  //         const detail = error instanceof FirebaseError ? error.code : error.message
  //         this.operationFailed(new StoreError('unknown-store-error', detail))
  //       })
  //   }
  // }

  // private updateRequest(opts: Partial<Settings>) {
  //   this.state.isLoading$.next(true)
  //   this.state.error$.next(null)

  //   const user = this.authService.user()
  //   if(!!user) {
  //     updateDoc<DocumentData, DocumentData>(this.docRef(user), opts)
  //       .then((_) => this.operationSucceeded())
  //       .catch(err => {
  //         const error = assertError(err)
  //         const detail = error instanceof FirebaseError ? error.code : error.message
  //         this.operationFailed(new StoreError('unknown-store-error', detail))
  //       })
  //   }
  // }

  // private clearRequest() {
  //   this.state.isLoading$.next(true)
  //   this.state.error$.next(null)

  //   const user = this.authService.user()
  //   if(!!user) {
  //     deleteDoc(this.docRef(user))
  //       .then(() => this.operationSucceeded())
  //       .catch(err => {
  //         const error = assertError(err)
  //         const detail = error instanceof FirebaseError ? error.code : error.message
  //         this.operationFailed(new StoreError('unknown-store-error', detail))
  //       })
  //   }
  // }

  // REDUCERS
  private setStateSubscription(sub: Unsubscribe) {
    this.state.unsubscribeToDocChanges = sub
  }

  private setStateOperationStarts() {
    this.state.isLoading$.next(true)
    this.state.error$.next(null)
  }

  private setStateOperationSucceeded() {
    this.state.isLoading$.next(false)
  }

  private setStateOperationFailed(storeError: StoreError) {
    this.state.isLoading$.next(false)
    this.state.error$.next(storeError)
  }

  private setStateDoc(data: Identifiable<Settings> | null) {
    this.state.doc$.next(data)
    
  }

  
  // SELECTORS
  readonly doc$ = this.state.doc$.asObservable()
  readonly doc = toSignal(this.state.doc$, {requireSync: true})

  readonly isLoading$ = this.state.isLoading$.asObservable()
  readonly isLoading = toSignal(this.state.isLoading$, {requireSync: true})

  readonly error$ = this.state.error$.asObservable()
  readonly error = toSignal(this.state.error$, {requireSync: true})

  set(item: Settings) {
    // this.setRequest(item)
  }

	update(opts: Partial<Settings>) {
    // this.updateRequest(opts)
  }

	clear() {
    // this.clearRequest()
  }
}
