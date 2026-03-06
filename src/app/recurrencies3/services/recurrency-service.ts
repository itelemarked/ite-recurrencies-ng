import { computed, inject, Injectable } from "@angular/core";
import { SettingsService } from "./settings-service";
import { Recurrency } from "../types/Recurrency";
import { isRecurrencyData, RecurrencyData } from "../types/RecurrencyData";
import { Identifiable } from "../types/Identifiable";


import { PositiveInteger } from "../../../js/timezone-date/types/PositiveInteger";
import { TimezoneDate } from "../../../js/timezone-date/TimezoneDate";
import { PeriodUnit } from "../../../js/timezone-date/types/PeriodUnit";
import { Timezone } from "../../../js/timezone-date/types/Timezone";


// TO DELETE
const dummyRec: Recurrency = {
  uid: 'ajdklaeiidnfre',
  title: 'Dummy',
  lastEvent: TimezoneDate.now('Europe/Zurich'),
  periodNb: 66 as PositiveInteger,
  periodUnit: 'days' as PeriodUnit,
  category: 'Aircraft'
}

@Injectable({providedIn: 'root'})
export class RecurrencyService {
  // DEPENDENCIES
  private settingsService = inject(SettingsService)

  private localStorageKey = 'ite-recurrencies-ng-recurrencies'

  recurrencies = computed(() => {
    const settings = this.settingsService.settings()

  })

  add = (data: RecurrencyData):Promise<Recurrency> => {
    // TODO
    return Promise.resolve(dummyRec)
  }

  remove = (uid: string): Promise<Recurrency> => {
    // TODO
    return Promise.resolve(dummyRec)
  }

  update = (data: Identifiable<RecurrencyData>): Promise<Recurrency> => {
    // TODO
    return Promise.resolve(dummyRec)
  }

  // PRIVATE
  getStoredRecurrencies(timezone: Timezone) {
    const stored = localStorage.getItem(this.localStorageKey)
    if(stored === null) {
      // return null
      console.log(null)
    } else {
      const parsed = JSON.parse(stored)
      const a = {
        // uid: '72845866', 
        title: 'Sere Sea', 
        lastEventString: '2026-01-03', 
        periodNb: 1, 
        periodUnit: 'years', 
        category: 'Aircraft'
      }
      console.log(isRecurrencyData(a))
    }
    

    // if(parsed.every((p: any) => isRecurrencyData(p) && hasUid(p))) {
    //   return parsed.map((p: any) => {
    //     const {uid, title, lastEventString, periodNb, periodUnit, category} = p
    //     return {
    //       uid,
    //       title,
    //       lastEvent: TimezoneDate.create(lastEventString, SHORT_BEFORE_MIDNIGHT, timezone),
    //       periodNb,
    //       periodUnit,
    //       category
    //     }
    //   })
    // } else {
    //   return null
    // }


    // const storedRecurrenciesString = localStorage.getItem(this.localStorageKey)
    // if(storedRecurrenciesString === null) {
    //   return null
    // }

    // const storedRecurrencies = JSON.parse(storedRecurrenciesString) 
    // function areStoredRecurrencyDatas(val: any): val is RecurrencyData[] {
    //   return val !== null
    //   && isPlainObject(val)
    //   && Object.values(storedRecurrencies).every((data) => isRecurrencyData(data))
    // }
    
    // if(!areStoredRecurrencyDatas(storedRecurrencies)) {
    //   return null
    // }
    // return Object.entries(storedRecurrencies)
    //   .map(
    //     ([key, data]) => new Recurrency(key, data, this.timezone())
    //   )
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