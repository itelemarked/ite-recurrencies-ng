import { Observable } from "rxjs";
import { User } from "./User";
import { Signal } from "@angular/core";

type DataLoading = {
  status: 'loading'
}

type DataError = {
  status: 'error',
  error: string
}

type DataSuccess<T> = {
  status: 'success',
  value: T | null
}

export type Data<T> = DataLoading | DataError | DataSuccess<T>


export interface AuthServiceInterface {
  userData$: Observable<Data<User>>
  userData: Signal<Data<User>>
  login: (email: string, password: string) => Promise<void>
  signup: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}