import { Signal } from "@angular/core";

export interface IStoreDocument<T> {
  get$(): Signal<T | undefined>
  // set(path: string, item: T): Promise<void>
  // delete(path: string): Promise<void>
}