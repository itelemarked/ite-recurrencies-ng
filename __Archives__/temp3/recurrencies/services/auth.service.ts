import { inject, Injectable } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { toSignal } from "@angular/core/rxjs-interop";
import { catchError, map, of, startWith } from "rxjs";
import { AuthServiceInterface } from "../types/AuthServiceInterface";
import { AuthState } from "../types/AuthState";

@Injectable({providedIn: 'root'})
export class AuthService 
implements AuthServiceInterface 
{

  private fbAuth = inject(AngularFireAuth)

  state$ = this.fbAuth.authState.pipe(
    map(fbUser => {
      if(fbUser === null) {
        return {
          state: 'success',
          data: null
        } as AuthState
      }
      
      const email = fbUser.email!
      const uid = fbUser.uid
      return {
        state: 'success',
        data: {uid, email}
      } as AuthState
    }),
    startWith({state: 'loading'} as AuthState),
    catchError(err => {
      return of({
        state: 'error',
        message: err.message
      } as AuthState)
    })
  )

  state = toSignal(this.state$, {requireSync: true})

  // TODO
  login(email: string, password: string) {
    return Promise.resolve()
  }

  // TODO
  signup(email: string, password: string) {
    return Promise.resolve()
  }

  // TODO
  logout() {
    return Promise.resolve()
  }

}