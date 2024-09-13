import { Routes } from "@angular/router";
import { RecurrencyListPage } from "./recurrency-list.page";

const ORIGIN = 'list'

export const recurrenciesRoutes: Routes = [
  { path: '', redirectTo: ORIGIN, pathMatch: 'full' },

  { path: 'list', component: RecurrencyListPage },

  { path: '**', redirectTo: ORIGIN, pathMatch: 'full' }
];