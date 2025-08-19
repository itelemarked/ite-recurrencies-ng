import { computed, inject, Injectable, signal, Signal } from "@angular/core";


type PlainObject = Record<string, any>

type Storable<T> = T & { uid: string }

type IStore<T extends PlainObject> = {
  getAll: () => Signal<Storable<T>[] | null | undefined>
  setAll: (val: Storable<T>[]) => Promise<void>
  addDoc: (doc: T | Storable<T>) => Promise<void>
  updateDoc: (doc: Storable<Partial<T>>) => Promise<Storable<T>>
  removeDoc: (uid: string) => Promise<Storable<T>>
}

async function wait(delayMs: number): Promise<void> {
  return new Promise(resolve => setTimeout(() => resolve(), delayMs))
}

function generatedUid() {
  const random = () => Math.floor(Math.random() * 1000)
  return 'uid-' + Date.now() + '-' + random()
}


type MyData = {
  title: string
}

let MOCK: Storable<MyData>[] = [
  {uid: 'uid-0', title: 'Item 0'},
  {uid: 'uid-1', title: 'Item 1'},
  {uid: 'uid-2', title: 'Item 2'},
]


@Injectable({providedIn: 'root'})
export class SettingsService {

  private _dataSig = signal< Storable<MyData>[] | undefined | null >(undefined)

  constructor() {
    this._fetchMock().then(res => this._dataSig.set(res))
  }

  private async _fetchMock() {
    await wait(1000)
    return MOCK
  }

  private async _saveMock(newMocks: Storable<MyData>[]) {
    await wait(1000)
    MOCK = newMocks
    return MOCK
  }

  getAll = computed(() => this._dataSig())

  async addDoc(doc: MyData | Storable<MyData>) {
    await wait(500)
    if ('uid' in doc) {
      MOCK.push(doc as Storable<MyData>)
    } else {
      MOCK.push({...doc, uid: generatedUid()})
    }
    this._dataSig.set(MOCK)
  }

  async updateDoc(doc: Storable<Partial<MyData>>) {
    await wait(500)
    const idx = MOCK.findIndex(m => m.uid === doc.uid)
    if (idx === -1) throw new Error('no item to update... uid not found')
    MOCK[idx] = {...MOCK[idx], ...doc}
    this._dataSig.set(MOCK)
  }

  async removeDoc(uid: string) {
    await wait(500)
    const idx = MOCK.findIndex(m => m.uid === uid)
    if (idx === -1) throw new Error('no item to remove... uid not found')
    MOCK = MOCK.filter(m => m.uid !== uid)
    this._dataSig.set(MOCK)
  }

}