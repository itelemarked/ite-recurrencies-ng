import { Signal } from "@angular/core";
import { Observable } from "rxjs";

import { Recurrency } from "./Recurrency";
import { RecurrencyData } from "./RecurrencyData";
import { Identifiable } from "./Identifiable";
import { RecurrencyError } from "./RecurrencyError";

export interface RecurrencyServiceInterface {
  recurrencies$: Observable<Identifiable<Recurrency>[]>
  recurrencies: Signal<Identifiable<Recurrency>[]>
  loading$: Observable<boolean>
  loading: Signal<boolean>
  errors$: Observable<RecurrencyError[]>
  errors: Signal<RecurrencyError[]>
  
  setDoc: (recurrencies: Identifiable<Recurrency>) => Promise<void>
  addDoc: (data: RecurrencyData) => Promise<string>
  updateDoc: (uid: string, opts: Partial<Recurrency>) => Promise<void>
  deleteDoc: (uid: string) => Promise<void>
}