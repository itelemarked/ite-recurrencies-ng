import { inject, Injectable } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { BehaviorSubject } from "rxjs";

import { TimezoneDate } from "../../../js/timezone-date/TimezoneDate";
import { Timezone } from "../../../js/timezone-date/types/Timezone";
import { DateFormat } from "../../../js/timezone-date/types/DateFormat";
import { SHORT_BEFORE_MIDNIGHT } from "../../../js/timezone-date/const/const";

import { SettingsService } from "../../settings/services/settings-service";

import { isArray } from "../../../js/types/valid-type";
import { isRecurrencyData, RecurrencyData } from "../../_types/RecurrencyData";
import { RECURRENCY_ERROR, RecurrencyError } from "../../_types/RecurrencyError";
import { RecurrencyServiceInterface } from "../../_types/RecurrencyServiceInterface";
import { Recurrency } from "../../_types/Recurrency";
import { Identifiable, isIdentifiable } from "../../_types/Identifiable";



// TYPES ****************************************
type RecurrencyResponseSuccess = {
  type: 'success',
  data: Identifiable<RecurrencyData>[]
}

type RecurrencyResponseError = {
  type: 'error',
  error: RecurrencyError
}

type RecurrencyResponse = RecurrencyResponseSuccess | RecurrencyResponseError




// SERVICE **************************************
@Injectable({providedIn: 'root'})
export class RecurrencyService implements RecurrencyServiceInterface {

  // CONSTS -------------------------------------------
  private STORE_KEY = 'ite-recurrencies-ng-recurrencies'

  // DEPENDENCIES -------------------------------------------
  private settingsService = inject(SettingsService)

  // STATE -------------------------------------------
  private state = {
    recurrencies$: new BehaviorSubject<Identifiable<Recurrency>[]>([]),
    loading$: new BehaviorSubject<boolean>(true),
    errors$: new BehaviorSubject<RecurrencyError[]>([])
  }

  // SELECTORS -------------------------------------------
  recurrencies$ = this.state.recurrencies$.asObservable()
  recurrencies = toSignal(this.state.recurrencies$, {requireSync: true})
  loading$ = this.state.loading$.asObservable()
  loading = toSignal(this.state.loading$, {requireSync: true})
  errors$ = this.state.errors$.asObservable()
  errors = toSignal(this.state.errors$, {requireSync: true})
  

  // ACTIONS -------------------------------------------
  constructor() {
    const fetch = this._fetchData
    const parse = this._parse
    const fromData = this._fromData
    const {timezone, dateFormat} = this.settingsService.settings()
    const state = this.state

    fetch().then(res => {
      const parseResponse = parse(res)
      state.loading$.next(false)
      if(parseResponse.type === 'error') {
        state.errors$.next([...state.errors$.value, parseResponse.error])
      }
      else {
        const recurrencies = parseResponse.data.map(d => fromData(d, timezone, dateFormat))
        state.recurrencies$.next(recurrencies)
      }
    })
  }

  // TODO: setDocs or setDoc??? only one, ar all????
  setDocs = async (recurrencies: Identifiable<Recurrency>[]) => {
    const toData = this._toData
    const store = this._storeData

    this.state.recurrencies$.next(recurrencies)
    const recurrenciesData = recurrencies.map(r => toData(r))
    await store(recurrenciesData)
    return
  }

  addDoc = async (data: RecurrencyData): Promise<string> => {
    const {timezone, dateFormat} = this.settingsService.settings()
    const uid = this._generatedUid()
    const identifiableData = {...data, uid}
    const recurrency = this._fromData(identifiableData, timezone, dateFormat)
    const recurrencies = [...this.state.recurrencies$.value, recurrency]
    this.state.recurrencies$.next(recurrencies)
    this._storeData(recurrencies.map(r => this._toData(r)))
    return uid
  }

  deleteDoc = async (uid: string): Promise<void> => {
    const recurrencies = this.state.recurrencies$.value.filter(r => r.uid !== uid)
    this.state.recurrencies$.next(recurrencies)
    this._storeData(recurrencies.map(r => this._toData(r)))
    return 
  }

  // TODO: opts should be Partial<Recurrency>? Or Partial<RecurrencyData>????
  updateDoc = async (uid: string, opts: Partial<Recurrency>) => {
    const recurrencyToUpdate = this.state.recurrencies$.value.find((r => r.uid === uid))
    if(recurrencyToUpdate === undefined) return
    const updatedRecurrency = {...recurrencyToUpdate, ...opts}
    const filteredRecurrencies = this.state.recurrencies$.value.filter(r => r.uid !== uid)

    const recurrencies = [...filteredRecurrencies, updatedRecurrency]
    this.state.recurrencies$.next(recurrencies)
    this._storeData(recurrencies.map(r => this._toData(r)))
    return 
  }

  // UTILS -------------------------------------------
  _fetchData = async (): Promise<string | null> => {
    const delay = this._delay
    await delay(800)

    const key = this.STORE_KEY
    return localStorage.getItem(key)
  }

  _parse = (data: string | null): RecurrencyResponse => {
    if(data === null) return {
      type: 'success',
      data: []
    }

    const parsedData = JSON.parse(data)
    const isIdentifiableRecurrencyDataArray = (val: any): val is Identifiable<RecurrencyData>[] => 
      isArray(val) && val.every(d => isRecurrencyData(d) && isIdentifiable(d))
    
    if(!isIdentifiableRecurrencyDataArray(parsedData)) return {
      type: 'error',
      error: RECURRENCY_ERROR.fetch_data_wrong_type
    }

    return {
      type: 'success',
      data: parsedData
    }
  }

  _fromData = (data: Identifiable<RecurrencyData>, timezone: Timezone, dateFormat: DateFormat): Identifiable<Recurrency> => {
    const lastEvent = TimezoneDate.create(data.lastEventString, SHORT_BEFORE_MIDNIGHT, timezone, dateFormat)
    const result: Identifiable<Recurrency> = {...data, lastEvent}
    return result
  }

  _storeData = async (data: Identifiable<RecurrencyData>[]) => {
    const delay = this._delay
    const key = this.STORE_KEY

    await delay(300)
    localStorage.setItem(key, JSON.stringify(data))
  }

  _toData = (recurrency: Identifiable<Recurrency>): Identifiable<RecurrencyData> => {
    /** the lastEventString is parsed to UTC */
    const lastEventString = recurrency.lastEvent.dateString({timezone: 'UTC'})
    return {...recurrency, lastEventString}
  }

  _generatedUid = () => {
    return Math.floor(Math.random() * 100000000).toString()
  }





  // _fetchData = async (): Promise<RecurrencyResponse> => {
  //   const fromData = this._fromData

  //   // DEV only
  //   const delay = this._delay
  //   await delay(300)

  //   const dataString = localStorage.getItem(this.STORE_KEY)
  //   if(dataString === null) {
  //     return {
  //       type: 'success',
  //       data: []
  //     }
  //   }

  //   const data = JSON.parse(dataString)
  //   const isIdentifiableRecurrencyDataArray = (val: any): val is Identifiable<RecurrencyData>[] => 
  //     isArray(data) && data.every(d => isRecurrencyData(d) && isIdentifiable(d))


  //   if(!isIdentifiableRecurrencyDataArray(data)) {
  //     return {
  //       type: 'error',
  //       error: RECURRENCY_ERROR.fetch_data_wrong_type
  //     }
  //   }

  //   const {timezone, dateFormat} = this.settingsService.settings()
  //   const result = data.map(d => fromData(d, timezone, dateFormat))
  //   return {
  //     type: 'success',
  //     data: result
  //   }
  // }

  // _storeData = (recurrency: Recurrency | Identifiable<Recurrency>): Promise<RecurrencyResponse> => {
  //   const toData = this._toData

  //   const data = toData(recurrency)
  // }

  // _fromData = (data: Identifiable<RecurrencyData>, timezone: Timezone, dateFormat: DateFormat) => {
  //   const lastEvent = TimezoneDate.create(data.lastEventString, SHORT_BEFORE_MIDNIGHT, timezone, dateFormat)
  //   const result: Identifiable<Recurrency> = {...data, lastEvent}
  //   return result
  // }

  // _toData = (recurrency: Recurrency | Identifiable<Recurrency>): Identifiable<RecurrencyData> => {
  //   const generatedUid = this._generatedUid

  //   const lastEventString = recurrency.lastEvent.dateString()
  //   const uid = 'uid' in recurrency ? recurrency.uid : generatedUid()
  //   return {...recurrency, lastEventString, uid}
  // }

  // _generatedUid = () => {
  //   return Math.floor(Math.random() * 100000000).toString()
  // }

  // DEV only
  _delay = (ms: number): Promise<void> => new Promise(resolve => setTimeout(() => resolve(), ms))

}




// import { computed, inject, Injectable } from "@angular/core";
// import { toSignal } from "@angular/core/rxjs-interop";
// import { BehaviorSubject } from "rxjs";

// import { isPlainObject } from "../../../js/valid-type";

// import { Recurrency } from "../types/Recurrency";
// import { isRecurrencyData, RecurrencyData } from "../types/RecurrencyData";

// import { SettingsService } from "../../settings/settings.service";



// @Injectable({providedIn: 'root'})
// export class RecurrencyService {
//   // DEPENDENCIES
//   private settingsService = inject(SettingsService)

//   // STATE
//   private state = {
//     recurrencies$: new BehaviorSubject<Recurrency[]>([])
//   }

//   // SELECTORS
//   private localStorageKey = 'ite-recurrencies-ng-recurrencies'
//   private timezone = computed(() => this.settingsService.settings().timezone)

//   constructor() {
//     const storedRecurrencies = this.localStorageGet()
//     if(storedRecurrencies !== null) {
//       this.state.recurrencies$.next(storedRecurrencies)
//     }
//   }

//   recurrencies$ = this.state.recurrencies$.asObservable()

//   recurrencies = toSignal(this.recurrencies$, {requireSync: true})

//   set(recurrencies: Recurrency[]): Promise<void> {
//     this.state.recurrencies$.next(recurrencies)
//     this.localStorageSet(recurrencies)
//     return Promise.resolve()
//   }

//   update(recurrency: Recurrency) {
//     const currentRecurrencies = this.state.recurrencies$.getValue()
//     const newRecurrencies = [
//       ...currentRecurrencies.filter(rec => rec.uid !== recurrency.uid), 
//       recurrency
//     ]
//     this.state.recurrencies$.next(newRecurrencies)
//     this.localStorageSet(newRecurrencies)
//   }

//   add(recurrencyData: RecurrencyData): Promise<Recurrency> {
//     const uid = this.generateUid()
//     const newRecurrency = new Recurrency(uid, recurrencyData, this.timezone())
//     const currentRecurrencies = this.state.recurrencies$.getValue()
//     const newRecurrencies = [...currentRecurrencies, newRecurrency]
//     this.state.recurrencies$.next(newRecurrencies)
//     this.localStorageSet(newRecurrencies)
//     return Promise.resolve(newRecurrency)
//   }

//   remove(uid: string): Promise<Recurrency | null> {
//     const removedRecurrency = this.state.recurrencies$.getValue().find(rec => rec.uid === uid)
//     if(removedRecurrency === undefined) {
//       return Promise.resolve(null)
//     }

//     const newRecurrencies = this.state.recurrencies$.getValue().filter(rec => rec.uid !== uid)
//     this.state.recurrencies$.next(newRecurrencies)
//     if(newRecurrencies.length === 0) {
//       this.localStorageRemove()
//     } else {
//       this.localStorageSet(newRecurrencies)
//     }
//     return Promise.resolve(removedRecurrency)
//   }

//   private generateUid(): string {
//     return Math.floor(Math.random() * 100000000).toString()
//   }

//   private localStorageGet(): Recurrency[] | null {
//     const storedRecurrenciesString = localStorage.getItem(this.localStorageKey)
//     if(storedRecurrenciesString === null) {
//       return null
//     }

//     const storedRecurrencies = JSON.parse(storedRecurrenciesString) 
//     function areStoredRecurrencyDatas(val: any): val is RecurrencyData[] {
//       return val !== null
//       && isPlainObject(val)
//       && Object.values(storedRecurrencies).every((data) => isRecurrencyData(data))
//     }
    
//     if(!areStoredRecurrencyDatas(storedRecurrencies)) {
//       return null
//     }
//     return Object.entries(storedRecurrencies)
//       .map(
//         ([key, data]) => new Recurrency(key, data, this.timezone())
//       )
//   }

//   private localStorageSet(recurrencies: Recurrency[]) {
//     const recurrenciesObject = recurrencies.reduce(
//       (acc, rec) => {
//         const key = rec.uid
//         const data = rec.toData()
//         acc[key] = data
//         return acc
//       },
//       {} as Record<string, RecurrencyData>
//     )
//     localStorage.setItem(this.localStorageKey, JSON.stringify(recurrenciesObject))
//   }

//   private localStorageRemove() {
//     localStorage.removeItem(this.localStorageKey)
//   }

// }