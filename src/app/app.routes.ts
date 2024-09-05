import { Routes } from '@angular/router';
import { HomePage } from './modules/home/home.page';
import { RecurrencyPage } from './modules/recurrency/recurrency.page';
import { recurrenciesRoutes } from './modules/recurrency/recurrency.routes'
import { TestPage } from './modules/test/test.page';

const ORIGIN = '/recurrencies'

export const routes: Routes = [
  { path: '', redirectTo: ORIGIN, pathMatch: 'full' },

  { path: 'home', component: HomePage },
  { path: 'recurrencies', component: RecurrencyPage, children: recurrenciesRoutes },
  { path: 'test', component: TestPage },

  { path: '**', redirectTo: ORIGIN, pathMatch: 'full' }
];

