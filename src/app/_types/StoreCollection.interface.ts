import { Signal } from "@angular/core"

export interface IStoreCollection<T> {
  getAll$(path: string): Signal<T[] | undefined>
  getById$(path: string, id: string): Signal<T>
  add(path: string, item: T): Promise<void>
  remove(path: string, item: T): Promise<void>
}