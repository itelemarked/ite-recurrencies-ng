import { Routes } from '@angular/router';
import { HomePage } from './modules/home/home.page';
import { RecurrenciesPage } from './modules/recurrencies/recurrencies.page';
import { recurrenciesRoutes } from './modules/recurrencies/recurrencies.routes'

const ORIGIN = '/home'

export const routes: Routes = [
  { path: '', redirectTo: ORIGIN, pathMatch: 'full' },

  { path: 'home', component: HomePage },
  { path: 'recurrencies', component: RecurrenciesPage, children: recurrenciesRoutes },

  { path: '**', redirectTo: ORIGIN, pathMatch: 'full' }
];
