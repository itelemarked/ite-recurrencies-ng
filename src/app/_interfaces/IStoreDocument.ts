import { Signal } from "@angular/core";
import { Observable } from "rxjs";

export interface IStoreDocument<T> {
  get$(): Observable<T | null>
  // set(path: string, item: T): Promise<T>
  // delete(path: string): Promise<T>
}