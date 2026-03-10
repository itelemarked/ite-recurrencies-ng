import { Signal } from "@angular/core";

import { Recurrency } from "./Recurrency";
import { RecurrencyData } from "./RecurrencyData";
import { Identifiable } from "./Identifiable";
import { SettingsServiceInterface } from "./SettingsServiceInterface";

export interface RecurrencyServiceInterface {
  getAll: () => Signal<Identifiable<Recurrency>[]>
  addDoc: (data: RecurrencyData) => Promise<string>
  setDoc: (recurrency: Identifiable<Recurrency>) => Promise<void>
  updateDoc: (uid: string, opts: Partial<Recurrency>) => Promise<void>
  deleteDoc: (uid: string) => Promise<void>
}