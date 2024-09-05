import { Observable } from "rxjs"

export interface IStore {
  get$<T>(path: string): Observable<T | null>,
  set<T>(path: string, item: T): Promise<void>
  delete(path: string): Promise<void>
}