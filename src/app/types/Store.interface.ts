import { Signal } from "@angular/core"


// CRUD
export interface IStore<T extends object & { uid: string }> {
  get: (uid: string) => Signal<T & {uid: string} | null | undefined>,
  getAll: () => Signal<(T & {uid: string})[] | null | undefined>,
  add: (val: T & {uid?: string}) => Promise<T & {uid: string}>,
  update: (val: Partial<T> & {uid: string}) => Promise<void>,
  delete: (uid: string) => Promise<void>,
}
