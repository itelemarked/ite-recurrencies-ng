import { computed, inject, Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { isRecurrencyData, Recurrency, RecurrencyData } from "../types/Recurrency.type";

import { toSignal } from "@angular/core/rxjs-interop";
import { isPlainObject } from "../../../js/valid-type";
import { SettingsService } from "../../recurrencies3/services/settings-service";



@Injectable({providedIn: 'root'})
export class RecurrencyService {
  // DEPENDENCIES
  private settingsService = inject(SettingsService)

  // STATE
  private state = {
    recurrencies$: new BehaviorSubject<Recurrency[]>([])
  }

  // SELECTORS
  private localStorageKey = 'ite-recurrencies-ng-recurrencies'
  private timezone = computed(() => this.settingsService.settings().timezone)

  constructor() {
    const storedRecurrencies = this.localStorageGet()
    if(storedRecurrencies !== null) {
      this.state.recurrencies$.next(storedRecurrencies)
    }
  }

  recurrencies$ = this.state.recurrencies$.asObservable()

  recurrencies = toSignal(this.recurrencies$, {requireSync: true})

  set(recurrencies: Recurrency[]): Promise<void> {
    this.state.recurrencies$.next(recurrencies)
    this.localStorageSet(recurrencies)
    return Promise.resolve()
  }

  add(recurrencyData: RecurrencyData): Promise<Recurrency> {
    const uid = this.generateUid()
    const newRecurrency = new Recurrency(uid, recurrencyData, this.timezone())
    const currentRecurrencies = this.state.recurrencies$.getValue()
    const newRecurrencies = [...currentRecurrencies, newRecurrency]
    this.state.recurrencies$.next(newRecurrencies)
    this.localStorageSet(newRecurrencies)
    return Promise.resolve(newRecurrency)
  }

  remove(uid: string): Promise<Recurrency | null> {
    const removedRecurrency = this.state.recurrencies$.getValue().find(rec => rec.uid === uid)
    if(removedRecurrency === undefined) {
      return Promise.resolve(null)
    }

    const newRecurrencies = this.state.recurrencies$.getValue().filter(rec => rec.uid !== uid)
    this.state.recurrencies$.next(newRecurrencies)
    if(newRecurrencies.length === 0) {
      this.localStorageRemove()
    } else {
      this.localStorageSet(newRecurrencies)
    }
    return Promise.resolve(removedRecurrency)
  }

  private generateUid(): string {
    return Math.floor(Math.random() * 100000000).toString()
  }

  private localStorageGet(): Recurrency[] | null {
    const storedRecurrenciesString = localStorage.getItem(this.localStorageKey)
    if(storedRecurrenciesString === null) {
      return null
    }

    const storedRecurrencies = JSON.parse(storedRecurrenciesString) 
    function areStoredRecurrencyDatas(val: any): val is RecurrencyData[] {
      return val !== null
      && isPlainObject(val)
      && Object.values(storedRecurrencies).every((data) => isRecurrencyData(data))
    }
    
    if(!areStoredRecurrencyDatas(storedRecurrencies)) {
      return null
    }
    return Object.entries(storedRecurrencies)
      .map(
        ([key, data]) => new Recurrency(key, data, this.timezone())
      )
  }

  private localStorageSet(recurrencies: Recurrency[]) {
    const recurrenciesObject = recurrencies.reduce(
      (acc, rec) => {
        const key = rec.uid
        const data = rec.toData()
        acc[key] = data
        return acc
      },
      {} as Record<string, RecurrencyData>
    )
    localStorage.setItem(this.localStorageKey, JSON.stringify(recurrenciesObject))
  }

  private localStorageRemove() {
    localStorage.removeItem(this.localStorageKey)
  }

}
