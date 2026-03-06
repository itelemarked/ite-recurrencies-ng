import { Signal } from "@angular/core";

import { Recurrency } from "./Recurrency";
import { RecurrencyData } from "./RecurrencyData";
import { Identifiable } from "./Identifiable";
import { SettingsServiceInterface } from "./SettingsServiceInterface";

export interface RecurrencyServiceInterface {
  settingsService: SettingsServiceInterface
  recurrencies: Signal<Recurrency[]>
  add: (data: RecurrencyData) => Promise<Recurrency>
  remove: (uid: string) => Promise<Recurrency>
  update: (data: Identifiable<RecurrencyData>) => Promise<Recurrency>
}