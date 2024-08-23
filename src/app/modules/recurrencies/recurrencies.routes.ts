import { Routes } from "@angular/router";
import { RecurrenciesListPage } from "./pages/recurrencies-list.page";

const ORIGIN = 'list'

export const recurrenciesRoutes: Routes = [
  { path: '', redirectTo: ORIGIN, pathMatch: 'full' },

  { path: 'list', component: RecurrenciesListPage },

  { path: '**', redirectTo: ORIGIN, pathMatch: 'full' }
];