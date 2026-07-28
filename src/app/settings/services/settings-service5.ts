import { inject, Injectable } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { BehaviorSubject, catchError, combineLatest, filter, ignoreElements, map, merge, NEVER, Observable, of, shareReplay, skip, Subject, switchMap, withLatestFrom } from 'rxjs';

import { doc, DocumentData, DocumentSnapshot, FirestoreError, onSnapshot } from 'firebase/firestore';

import { FirebaseService } from '../../_core/firebase-service';
import { User } from '../../_types/User';
import { isSettings, Settings } from '../../_types/Settings';
import { AuthService } from '../../auth/services/auth-service5';
import { FirebaseError } from 'firebase/app';
import { log } from '../../../js/errors/rxjs-operator-log';


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




type FetchedDataSuccess = { type: 'success', data: Settings | null }
type FetchedDataError = { type: 'error', error: Error }
type FetchedData = FetchedDataSuccess | FetchedDataError


@Injectable({ providedIn: 'root' })
export class SettingsService {
  // export class AuthService {
  private fbStore = inject(FirebaseService).firestore
  private authService = inject(AuthService)

  private docRef = (user: User) => doc(this.fbStore, `users/${user.uid}/settings/SETTINGS_UID`)

  /**
   * Intended to be used as 'inner observable' of a switchMap (when the 'source$' emits, the old stream will be killed)
   * Since the streams is not intended to be killed, it shall not error --> a potential error is returned instead of thrown.
   * @returns - {type: 'success', data: Settings | null} | {type: 'error', error: Error}
   */
  private onSnapShotForUser$ = (user: User | null | undefined) => new Observable<FetchedData>(subscriber => {
    if(user !== null && user !== undefined) {
      // the stream must never be killed here (neither error nor complete!)
      // no need to unregister, since it will be automatically killed by SwitchMap.
      onSnapshot(this.docRef(user), {
        next: (doc) => {
          const data = doc.data()
          if(data === undefined) {
            subscriber.next({
              type: 'success',
              data: null
            })
          }
          else if(isSettings(data)) {
            subscriber.next({
              type: 'success', 
              data 
            })
          }
          else {
            subscriber.next({
              type: 'error', 
              error: new Error('invalid-data', {cause: data})
            })
          }
        },
        error: (err) => subscriber.next({
          type: 'error', 
          error: new Error('unknown-store-error', {cause: err.code})
        })
      })
    }
  }).pipe(
    // log('auth-settings-onSnapShotForUser$')
  )

  // STATE
  private state = {
    doc$: new BehaviorSubject<Settings | null | undefined>(undefined),
    isLoading$: new BehaviorSubject<boolean>(true),
    error$: new BehaviorSubject<Error | null>(null)
  }
  // isLoading  -->   true:         authRequest started | settingsRequest started | initialisation
  //            -->   false:        backendData responded successfully (after request) | backendData responded with error (after a request)
  // error      -->   error:        auth has errors | backendData responded with error (after a request or suddenly) | backendData type is invalid
  //            -->   null:         authRequest started | settingsRequest started | backendData responded successfully (after request or suddenly) 
  // settings   -->   Settings:     backendData responded successfully (after request or suddenly) and type is valid
  //            -->   null:         backendData responded successfully (after request or suddenly) and is undefined
  //            -->   undefined:    initialisation


  // ACTIONS
  authUserChange$ = this.authService.user$

  authRequestStarted$ = this.authService.isLoading$.pipe(
    withLatestFrom(this.authService.user$.pipe(
    )),
    filter(([isLoading, user]) => isLoading === true && user !== undefined)
    // log('auth-settings-authRequestStarted$')
  )
  
  authErrored$ = this.authService.error$.pipe(
    filter(err => err !== null)
  )


  backendData$ = this.authUserChange$.pipe(
    switchMap(this.onSnapShotForUser$),
    shareReplay({bufferSize: 1, refCount: false}),
    // log('auth-settings-backendData$')
  )
  
  backendDataSuccess$ = this.backendData$.pipe(
    filter(response => response.type === 'success'),
    map(response => response.data),
    // log('auth-settings-backendDataSuccess$')
  )
  
  backendDataError$ = this.backendData$.pipe(
    filter(response => response.type === 'error'),
    map(response => response.error),
    // log('auth-settings-backendDataError$')
  )
  
  updateRequest$ = new Subject<Partial<Settings>>()
  setRequest$ = new Subject<Settings>()
  clearRequest$ = new Subject<void>()

  requestStarted$ = merge(
    this.authRequestStarted$,
    this.updateRequest$,
    this.setRequest$,
    this.clearRequest$
  ).pipe(
    // log('auth-settings-requestStarted$')
  )

  constructor() {
    this.backendDataSuccess$.pipe().subscribe(data => {
      this.state.doc$.next(data)
      this.state.isLoading$.next(false)
      this.state.error$.next(null)
    })

    this.backendDataError$.pipe().subscribe(error => {
      this.state.isLoading$.next(false)
      this.state.error$.next(error)
    })

    this.requestStarted$.pipe().subscribe((_) => {
      this.state.isLoading$.next(true)
      this.state.error$.next(null)
    })
  }

  // CONST
  

  // SELECTORS
  public readonly doc$ = this.state.doc$.asObservable()
  public readonly doc = toSignal(this.doc$, {requireSync: true})
  public readonly isLoading$ = this.state.isLoading$.asObservable()
  public readonly isLoading = toSignal(this.state.isLoading$, {requireSync: true})
  public readonly error$ = this.state.error$.asObservable()
  public readonly error = toSignal(this.state.error$, {requireSync: true})

  public readonly update = (opts: Partial<Settings>) => {
    // TODO: check it should be nexted
    this.updateRequest$.next(opts)
  }

  public readonly set = (doc: Settings) => {
    // TODO: check it should be nexted
    this.setRequest$.next(doc)
  }
  
  public readonly clear = () => {
    // TODO: check it should be nexted
    this.clearRequest$.next()
  }

}