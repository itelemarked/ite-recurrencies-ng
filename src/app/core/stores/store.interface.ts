import { Signal } from "@angular/core"
import { Observable } from "rxjs"

export interface IDocumentStore<T> {
  get$(): Signal<T | undefined>
  // set(path: string, item: T): Promise<void>
  // delete(path: string): Promise<void>
}

export interface ICollectionStore<T> {
  getAll$(path: string): Signal<T[] | undefined>
  getById$(path: string, id: string): Signal<T>
  add(path: string, item: T): Promise<void>
  remove(path: string, item: T): Promise<void>
}