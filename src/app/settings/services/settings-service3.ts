import { inject, Injectable } from "@angular/core";
import { takeUntilDestroyed, toSignal } from "@angular/core/rxjs-interop";
import { BehaviorSubject, distinctUntilChanged, filter } from "rxjs";

import { FirebaseError, FirebaseService, deleteDoc, doc, onSnapshot, setDoc, updateDoc } from "../../_core/firebase-service";

import { assertError } from "../../../js/errors/assertError";
import { AuthService } from "../../auth/services/auth-service";

import { DocumentStoreInterface } from "../../_types/DocumentStoreInterface2";
import { isSettings, Settings } from "../../_types/Settings";
import { StoreError } from "../../_types/StoreError";
import { Identifiable } from "../../_types/Identifiable";
import { User } from "../../_types/User";
import { DocumentData } from "firebase/firestore";



// // dev only
// const USER_A: User = {
//   uid: '0yuA0RLZFJdbRKtVSfW4y5HSQMq1',
//   email: 'aaa@aaa.com'
// }

/**
 * Children of the 'StoreService<T>' MUST provide the following properties:
 * - isType: (val: any) => val is T
 * - pathRef: (user: User) => string 
 * 
 * @example
 * .@Injectable({providedIn: 'root'})
 * export class SettingsService extends StoreService<Settings> {
 *    override isType = isSettings
 *    override pathRef = (user: User) => `users/${user.uid}/settings/SETTINGS_UID`
 * 
 *    constructor() {
 *      super()
 *    }
 * }
 */
@Injectable({providedIn: 'root'})
export abstract class StoreService<T extends Record<string, any>> implements DocumentStoreInterface<T> {

  private fbStore = inject(FirebaseService).firestore
  private authService = inject(AuthService)

  isType = (val: any): val is T => true
  pathRef = (user: User) => ''
  private docRef = (user: User) => doc(this.fbStore, this.pathRef(user))

  // STATE
  private state = {
    doc$: new BehaviorSubject<Identifiable<T> | null | undefined>(undefined),
    isLoading$: new BehaviorSubject<boolean>(true),
    error$: new BehaviorSubject<StoreError | null>(null),
    docChangeListenerUnsubscribe: () => {}
  }


  constructor() {
    this.authService.user$.pipe(
      takeUntilDestroyed(),
      distinctUntilChanged((prev, curr) => 
        prev === null && curr === null ||
        prev === undefined && curr === undefined ||
        !!prev && !!curr && (prev.uid === curr.uid)
      )
    ).subscribe(val => this.userChange(val))

    this.authService.isLoading$.pipe(
      takeUntilDestroyed(),
      filter(val => val === true)
    ).subscribe(val => this.userStartsLoading())
  }


  // ACTIONS/REDUCERS
  private userChange(user: User | null | undefined) {
    this.state.docChangeListenerUnsubscribe()
    this.state.isLoading$.next(true)
    this.state.error$.next(null)

    if(user !== null && user !== undefined) {
      this.state.docChangeListenerUnsubscribe = onSnapshot(this.docRef(user), {
        next: (doc) => {
          const data = doc.data()
          const uid = doc.id
          if(data === undefined) {
            this.docRealtimeChangeSuccess(null)
          }
          else if(this.isType(data)) {
            this.docRealtimeChangeSuccess({uid, ...data})
          }
          else {
            this.docRealtimeChangeFailure(new StoreError('invalid-data', {cause: {...data, uid}}))
          }
        },
        error: (err) => this.docRealtimeChangeFailure(new StoreError('unknown-store-error', err.code))
      })
    }
    else {
      this.state.isLoading$.next(false)
      this.state.doc$.next(null)
    }
  }
  
  private docRealtimeChangeSuccess(data: Identifiable<T> | null) {
    this.state.isLoading$.next(false)
    this.state.error$.next(null)
    this.state.doc$.next(data)
  }
  
  private docRealtimeChangeFailure(error: StoreError) {
    this.state.isLoading$.next(false),
    this.state.error$.next(error)
    this.state.doc$.next(null)
  }

  private userStartsLoading() {
    this.state.isLoading$.next(true)
    this.state.error$.next(null)
  }

  private setRequest(item: T) {
    this.state.isLoading$.next(true)
    this.state.error$.next(null)

    const user = this.authService.user()
    if(!!user) {
      setDoc(this.docRef(user), item)
        .then((_) => this.operationSuccess())
        .catch(err => {
          const error = assertError(err)
          const detail = error instanceof FirebaseError ? error.code : error.message
          this.operationFailure(new StoreError('unknown-store-error', detail))
        })
    }
  }

  private updateRequest(opts: Partial<T>) {
    this.state.isLoading$.next(true)
    this.state.error$.next(null)

    const user = this.authService.user()
    if(!!user) {
      updateDoc<DocumentData, DocumentData>(this.docRef(user), opts)
        .then((_) => this.operationSuccess())
        .catch(err => {
          const error = assertError(err)
          const detail = error instanceof FirebaseError ? error.code : error.message
          this.operationFailure(new StoreError('unknown-store-error', detail))
        })
    }
  }

  private clearRequest() {
    this.state.isLoading$.next(true)
    this.state.error$.next(null)

    const user = this.authService.user()
    if(!!user) {
      deleteDoc(this.docRef(user))
        .then(() => this.operationSuccess())
        .catch(err => {
          const error = assertError(err)
          const detail = error instanceof FirebaseError ? error.code : error.message
          this.operationFailure(new StoreError('unknown-store-error', detail))
        })
    }
  }

  private operationSuccess() {
    this.state.isLoading$.next(false)
  }

  private operationFailure(error: StoreError) {
    this.state.isLoading$.next(false)
    this.state.error$.next(error)
  }

  
  // SELECTORS
  readonly doc$ = this.state.doc$.asObservable()
  readonly doc = toSignal(this.state.doc$, {requireSync: true})

  readonly isLoading$ = this.state.isLoading$.asObservable()
  readonly isLoading = toSignal(this.state.isLoading$, {requireSync: true})

  readonly error$ = this.state.error$.asObservable()
  readonly error = toSignal(this.state.error$, {requireSync: true})

  set(item: T) {
    this.setRequest(item)
  }

	update(opts: Partial<T>) {
    this.updateRequest(opts)
  }

	clear() {
    this.clearRequest()
  }
}

@Injectable({providedIn: 'root'})
export class SettingsService extends StoreService<Settings> {
  override isType = isSettings
  override pathRef = (user: User) => `users/${user.uid}/settings/SETTINGS_UID`

  constructor() {
    super()
  }
}
