import { inject, Injectable } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { BehaviorSubject, catchError, filter, ignoreElements, map, NEVER, Observable, of, skip, switchMap } from 'rxjs';

import { doc, DocumentData, DocumentSnapshot, FirestoreError, onSnapshot } from 'firebase/firestore';

import { FirebaseService } from '../../_core/firebase-service';
import { User } from '../../_types/User';
import { isSettings, Settings } from '../../_types/Settings';
import { AuthService } from '../../auth/services/auth-service5';
import { FirebaseError } from 'firebase/app';


// @Injectable({ providedIn: 'root' })
// export class SettingsService {
//   // export class AuthService {
//   private fbStore = inject(FirebaseService).firestore
//   private authService = inject(AuthService)

//   private docRef = (user: User) => doc(this.fbStore, `users/${user.uid}/settings/SETTINGS_UID`)

//   // STATE
//   private state = {
//     doc$: new BehaviorSubject<Settings | null | undefined>(undefined),
//     isLoading$: new BehaviorSubject<boolean>(true),
//     error$: new BehaviorSubject<Error | null>(null),
//     unsubscribeToBackendChanges: () => {}
//   }

//   setStateLoading() {
//     this.state.error$.next(null)
//     this.state.isLoading$.next(true)
//   }

//   setStateSuccess(settings: Settings | null) {
//     this.state.doc$.next(settings)
//     this.state.error$.next(null)
//     this.state.isLoading$.next(false)
//   }

//   setStateError(error: Error) {
//     this.state.error$.next(error)
//     this.state.isLoading$.next(false)
//   }


//   constructor() {
//     this.authService.isLoading$.pipe(
//       filter(val => val === true),
//       skip(1) // skip initial
//     ).subscribe((_) => this.userChangeRequestStarted())

//     this.authService.user$.pipe(
//       filter(user => user !== undefined) // skip initial
//     ).subscribe((user) => this.userChangedSuccessfully(user))

//     this.authService.error$.pipe(
//       filter(err => err !== null)
//     ).subscribe(err => this.authenticationFailed(err))
//   }

//   // ACTIONS

//   private userChangeRequestStarted() {
//     this.setStateLoading()
//   }

//   private userChangedSuccessfully(user: User | null) {
//     this.state.unsubscribeToBackendChanges()

//     if(user !== null) {
//       this.state.unsubscribeToBackendChanges = onSnapshot(this.docRef(user), {
//         next: (snap) => {
//           const data = snap.data()
//           if(data === undefined) {
//             this.backendDataChangedSuccessfully(null)
//           }
//           else if (isSettings(data)) {
//             this.backendDataChangedSuccessfully(data)
//           }
//           else {
//             this.backendDataChangedWithError(new Error('invalid-data', {cause: data}))
//           }
//         },
//         error: (err) => {
//           this.backendDataChangedWithError(new Error('unkown-error', {cause: err.code}))
//         }
//       })
//     }
//   }

//   private authenticationFailed(error: Error) {
//     this.state.unsubscribeToBackendChanges()
//     this.setStateError(new Error('authentication-failed', {cause: error.message}))
//   }

//   private updateRequest(opts: Partial<Settings>) {}

//   private setRequest(doc: Settings) {}

//   private clearRequest() {}

//   private backendDataChangedSuccessfully(data: Settings | null) {
//     this.setStateSuccess(data)
//   }

//   private backendDataChangedWithError(error: Error) {
//     this.setStateError(error)
//   }

//   // SELECTORS
//   public readonly doc$ = this.state.doc$.asObservable()
//   public readonly doc = toSignal(this.doc$, {requireSync: true})
//   public readonly isLoading$ = this.state.isLoading$.asObservable()
//   public readonly isLoading = toSignal(this.state.isLoading$, {requireSync: true})
//   public readonly error$ = this.state.error$.asObservable()
//   public readonly error = toSignal(this.state.error$, {requireSync: true})

//   public readonly update = (opts: Partial<Settings>) => this.updateRequest(opts)
//   public readonly set = (doc: Settings) => this.setRequest(doc)
//   public readonly clear = () => this.clearRequest()

// }









@Injectable({ providedIn: 'root' })
export class SettingsService {
  // export class AuthService {
  private fbStore = inject(FirebaseService).firestore
  private authService = inject(AuthService)

  private docRef = (user: User) => doc(this.fbStore, `users/${user.uid}/settings/SETTINGS_UID`)

  // STATE
  private state = {
    doc$: new BehaviorSubject<Settings | null | undefined>(undefined),
    isLoading$: new BehaviorSubject<boolean>(true),
    error$: new BehaviorSubject<Error | null>(null),
    unsubscribeToBackendChanges: () => {}
  }

  private setStateLoading() {}
  private setStateSuccess(data: Settings | null) {}
  private setStateError(error: Error) {}


  constructor() {
    // this.authService.isLoading$.pipe(
    //   filter(val => val === true),
    //   skip(1) // skip initial
    // ).subscribe((_) => this.userChangeRequestStarted())

    // this.authService.user$.pipe(
    //   filter(user => user !== undefined) // skip initial
    // ).subscribe((user) => this.userChangedSuccessfully(user))

    // this.authService.error$.pipe(
    //   filter(err => err !== null)
    // ).subscribe(err => this.authenticationFailed(err))
  }

  // CONST
  

  // ACTIONS
  private userLoading() {
    this.setStateLoading() // --> auth.user$ or auth.error$
  }
  userLoading$ = this.authService.isLoading$.pipe(
    filter(val => val === true),
    skip(1)
  )

  private userChangeSuccess(user: User | null) {
    this.unsubscribeFromBackendDataListener()
    if(user === null) {
      this.setStateSuccess(null)
    }
    else {
      this.subscribeToBackendDataListener(user) // --> this.backendRealtimeChange
    }
  }
  userChangeToNull$ = this.authService.user$.pipe(
    filter(user => user === null)
  )
  


  private userError(error: Error) {}

  private backendDataChange(data: unknown) {}
  // may error!
  backendDataChange$ = (user: User) => new Observable<Settings | null>(subscriber => {
    const unsubscribe = onSnapshot(this.docRef(user), {
      next: (doc) => {
        const data = doc.data()
        if(data === undefined) {
          subscriber.next(null)
        }
        else if(isSettings(data)) {
          subscriber.next(data)
        }
        else {
          subscriber.error(new Error('invalid-data', {cause: data}))
        }
      },
      error: (err) => subscriber.error(new Error('unknown-store-error', {cause: err.code})),
    })
    subscriber.add(() => unsubscribe())
  })

  private dataValidationSuccess(data: Settings | null) {}
  dataChangeSuccess$ = this.authService.user$.pipe(
    filter(user => user !== null && user !== undefined),
    switchMap(user => this.backendDataChange$(user)),
    catchError(() => NEVER),
  )

  private dataValidationError(error: Error | null) {}
  dataChangeError$ = this.authService.user$.pipe(
    filter(user => user !== null && user !== undefined),
    switchMap(user => this.backendDataChange$(user)),
    ignoreElements(),
    catchError(err => of(err as Error))
  )

  private updateRequest(partialData: Partial<Settings>) {}
  private setRequest(data: Settings) {}
  private clearRequest() {}



  // SELECTORS
  public readonly doc$ = this.state.doc$.asObservable()
  public readonly doc = toSignal(this.doc$, {requireSync: true})
  public readonly isLoading$ = this.state.isLoading$.asObservable()
  public readonly isLoading = toSignal(this.state.isLoading$, {requireSync: true})
  public readonly error$ = this.state.error$.asObservable()
  public readonly error = toSignal(this.state.error$, {requireSync: true})

  public readonly update = (opts: Partial<Settings>) => this.updateRequest(opts)
  public readonly set = (doc: Settings) => this.setRequest(doc)
  public readonly clear = () => this.clearRequest()

}