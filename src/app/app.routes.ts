import { Routes } from '@angular/router';
import { HomePage } from './modules/home/home.page';
import { RecurrenciesPage } from './modules/recurrency/recurrency.page';
import { recurrenciesRoutes } from './modules/recurrency/recurrency.routes'

const ORIGIN = '/recurrencies'

export const routes: Routes = [
  { path: '', redirectTo: ORIGIN, pathMatch: 'full' },

  { path: 'home', component: HomePage },
  { path: 'recurrencies', component: RecurrenciesPage, children: recurrenciesRoutes },

  { path: '**', redirectTo: ORIGIN, pathMatch: 'full' }
];
