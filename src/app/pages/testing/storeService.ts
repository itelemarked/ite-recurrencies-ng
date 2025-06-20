import { computed, Injectable, signal, Signal, WritableSignal } from "@angular/core";


interface IStore<T extends (Record<string, any>)> {
  getDocs: Signal<StoreDoc<T>[]>
  setDocs: (val: StoreDoc<T>[]) => Promise<void>
  addDoc: (uid: string, data: T) => Promise<void>
  removeDoc: (uid: string) => Promise<T | undefined>
}

type StoreDoc<T> = T & { uid: string }

type Rec = {
  title: string,
}

@Injectable({providedIn: 'root'})
export class RecStore implements IStore<Rec> {

  private _recs: WritableSignal<StoreDoc<Rec>[]> = signal([
    { uid: '0', title: 'Rec-0' }
  ])

  getDocs = computed(() => this._recs())

  async setDocs(val: StoreDoc<Rec>[]) {
    this._recs.set(val)
  }

  async addDoc(uid: string, data: Rec) {
    this._recs.update((oldValue) => {
      const newDoc = {uid, ...data}
      return [...oldValue, newDoc]
    })
  }

  async removeDoc(uid: string) {
    const removedDoc = this._recs().find(doc => doc.uid === uid)
    this._recs.update(oldValue => oldValue.filter(doc => doc.uid !== uid))
    return removedDoc
  }

}
