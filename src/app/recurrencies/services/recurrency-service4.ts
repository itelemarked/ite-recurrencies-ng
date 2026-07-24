
import { inject, Injectable, Signal } from '@angular/core';
import { CollectionStoreInterface } from '../../_types/CollectionInterface';
import { Recurrency } from '../../_types/Recurrency';
import { BehaviorSubject, Observable } from 'rxjs';
import { StoreError } from '../../_types/StoreError';
import { Identifiable } from '../../_types/Identifiable';
import { toSignal } from '@angular/core/rxjs-interop';
import { FirebaseService } from '../../_core/firebase-service';
import { AuthService } from '../../auth/services/auth-service';
import { SettingsService } from '../../settings/services/settings-service3';
import { User } from '../../_types/User';
import { collection } from 'firebase/firestore';

@Injectable({ providedIn: 'root' })
export class RecurrencyService implements CollectionStoreInterface<Recurrency> {

  private fbStore = inject(FirebaseService).firestore
  private authService = inject(AuthService)
  private settingsService = inject(SettingsService)

  private collRef = (user: User) => collection(this.fbStore, `users/${user.uid}/recurrencies`)

  // STATE
  private state = {
    collection$: new BehaviorSubject<Identifiable<Recurrency>[] | null | undefined>(undefined),
    isLoading$: new BehaviorSubject<boolean>(true),
    error$: new BehaviorSubject<StoreError | null>(null),
    docChangeListenerUnsubscribe: () => {}
  }

  constructor() {}
  
  // ACTIONS/REDUCERS

  // SELECTORS
  readonly isLoading$ = this.state.isLoading$.asObservable()
	readonly isLoading = toSignal(this.state.isLoading$, {requireSync: true})
	readonly error$ = this.state.error$.asObservable()
	readonly error = toSignal(this.state.error$, {requireSync: true})
	readonly collection$ = this.state.collection$.asObservable()
	readonly collection = toSignal(this.state.collection$, {requireSync: true})

	update = (uid : string, opts: Partial<Recurrency>) => {}

	add = (item : Recurrency) => {}

	remove = (uid : string) => {}

	clear = () => {}

}