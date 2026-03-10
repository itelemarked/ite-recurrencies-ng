import { computed, inject, Injectable } from "@angular/core";
import { SettingsService } from "./settings-service";
import { Recurrency } from "../types/Recurrency";
import { isRecurrencyData, RecurrencyData } from "../types/RecurrencyData";
import { Identifiable } from "../types/Identifiable";


import { PositiveInteger } from "../../../js/timezone-date/types/PositiveInteger";
import { TimezoneDate } from "../../../js/timezone-date/TimezoneDate";
import { PeriodUnit } from "../../../js/timezone-date/types/PeriodUnit";
import { Timezone } from "../../../js/timezone-date/types/Timezone";
import { RecurrencyServiceInterface } from "../types/RecurrencyServiceInterface";
import { DateFormat } from "../../../js/timezone-date/types/DateFormat";
import { SHORT_BEFORE_MIDNIGHT } from "../../../js/timezone-date/const/const";


// TO DELETE
const dummyRec: Recurrency = {
  title: 'Dummy',
  lastEvent: TimezoneDate.createByDate(new Date(), 'Europe/Zurich', 'ISO'),
  periodNb: 66 as PositiveInteger,
  periodUnit: 'days' as PeriodUnit,
  category: 'Aircraft'
}

// UTILS
const fromData = (data: RecurrencyData, timezone: Timezone, dateFormat: DateFormat): Recurrency => {
  const lastEvent = TimezoneDate.create(data.lastEventString, SHORT_BEFORE_MIDNIGHT, timezone, dateFormat)
  return {...data, lastEvent}
}

const toData = (recurrency: Recurrency): RecurrencyData => {
  const lastEventString = recurrency.lastEvent.dateString()
  return {...recurrency, lastEventString}
}

const generateUid = () => {
  return Math.floor(Math.random() * 100000000).toString()
}

@Injectable({providedIn: 'root'})
export class RecurrencyService implements RecurrencyServiceInterface {
// export class RecurrencyService {
  // DEPENDENCIES
  private settingsService = inject(SettingsService)

  private localStorageKey = 'ite-recurrencies-ng-recurrencies'

  getAll = () => computed(() => {
    const settings = this.settingsService.settings()
    return [{...dummyRec, uid: 'heuwiehsm'}]
  })

  addDoc = (data: RecurrencyData) => {
    // TODO
    return Promise.resolve('djfdsksl')
  }

  setDoc = (recurrency: Identifiable<Recurrency>) => {
    // TODO
    return Promise.resolve()
  }

  updateDoc = (uid: string, opts: Partial<Recurrency>) => {
    // TODO
    return Promise.resolve()
  }

  deleteDoc = (uid: string) => {
    // TODO
    return Promise.resolve()
  }

  // PRIVATE
  getStoredRecurrencies(timezone: Timezone) {
    // const stored = localStorage.getItem(this.localStorageKey)
    // if(stored === null) {
    //   // return null
    //   console.log(null)
    // } else {
    //   const parsed = JSON.parse(stored)
    //   const a = {
    //     // uid: '72845866', 
    //     title: 'Sere Sea', 
    //     lastEventString: '2026-01-03', 
    //     periodNb: 1, 
    //     periodUnit: 'years', 
    //     category: 'Aircraft'
    //   }
    //   console.log(isRecurrencyData(a))
    // }
  }

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