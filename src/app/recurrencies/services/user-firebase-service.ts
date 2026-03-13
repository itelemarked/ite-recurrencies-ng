import { computed, inject, Injectable, signal } from '@angular/core';
import { UserServiceInterface } from '../types/UserServiceInterface';
import { User } from '../types/User';

import { createUserWithEmailAndPassword, deleteUser, onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { FirebaseService } from '../../core/firebase-service';
import { UserServiceState } from '../types/UserServiceState';




@Injectable({ providedIn: 'root' })
export class UserFirebaseService implements UserServiceInterface {

  // DEPENDENCIES ------------------------------------
  private auth = inject(FirebaseService).auth

  // STATE ------------------------------------
  private _state = signal<UserServiceState>({
    // status: 'loading',
    user: null,
    isLoading: true,
    error: null
  })

  // SELECTORS ------------------------------------
  user = computed<UserServiceState['user']>(() => this._state().user)
  isLoading = computed<UserServiceState['isLoading']>(() => this._state().isLoading)
  error = computed<UserServiceState['error']>(() => this._state().error)

  // ACTIONS ------------------------------------
  constructor() {
    onAuthStateChanged (this.auth, (fbUser) => {
      if(fbUser === null) {
        this._updateState({
          isLoading: false
        })
      }
      else {
        this._updateState({
          isLoading: false,
          user: { email: fbUser.email!, uid: fbUser.uid },
        })
      }
    })
  }

  login = async (email: string, password: string): Promise<UserServiceState> => {
    this._updateState({isLoading: true, error: null})
    try {
      const fbUser = await signInWithEmailAndPassword(this.auth, email, password)
      const user = {email: fbUser.user.email!, uid: fbUser.user.uid}
      this._updateState({
        isLoading: false, 
        user
      })
    } catch(err: any) {
      this._updateState({
        isLoading: false, 
        error: err.code
      })
    }
    return this._state()
  }

  signup = async (email: string, password: string): Promise<UserServiceState> => {
    this._updateState({isLoading: true, error: null})
    try {
      const fbUser = await createUserWithEmailAndPassword(this.auth, email, password)
      const user = {email: fbUser.user.email!, uid: fbUser.user.uid}
      this._updateState({
        isLoading: false, 
        user
      })
    } catch(err: any) {
      this._updateState({
        isLoading: false, 
        error: err.code
      })
    }
    return this._state()
  }

  logout = async (): Promise<UserServiceState> => {
    this._updateState({isLoading: true, error: null})
    await signOut(this.auth)
    this._updateState({isLoading: false, user: null})
    return this._state()
  }

  deleteCurrentUser = async (): Promise<UserServiceState> => {
    const currentUser = this.auth.currentUser
    if(currentUser === null) {
      return this._state()
    }

    this._updateState({isLoading: true, error: null})
    await deleteUser(currentUser)
    this._updateState({isLoading: false, user: null})
    return this._state()
  }

  // PRIVATE UTILS METHODS ------------------------------------
  private _updateState = (opts: Partial<UserServiceState>): void => {
    this._state.update(s => ({...s, ...opts}))
  }

}