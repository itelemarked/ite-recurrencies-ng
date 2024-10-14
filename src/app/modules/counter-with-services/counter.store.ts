import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, take } from "rxjs";


interface IStoreDocument<T> {
  get$(): Observable<T> 
  getOnce(): T 
  set(value: number): Promise<T>
}


@Injectable({providedIn: 'root'})
export class CounterService implements IStoreDocument<number>{

  private _value = new BehaviorSubject<number>(0)

  constructor() {}

  get$(): Observable<number> {
    return this._value.asObservable()
  }

  getOnce(): number {
    return this._value.getValue()
  }

  set(value: number): Promise<number> {
    this._value.next(value)
    return Promise.resolve(value)
  }

}

const STORES = {
  'counter': CounterService
}

export function store(name: keyof typeof stores, stores = STORES) {
  return stores[name]
}

console.log(store('counter'))

@Injectable({providedIn: 'root'})
export class StoreService {
  constructor(
    public counter: CounterService
  ) {}
}
