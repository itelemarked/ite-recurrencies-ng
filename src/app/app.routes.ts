import { Routes } from '@angular/router';
import { HomePage } from './modules/home/home.page';
import { RecurrencyPage } from './modules/recurrency/recurrency.page';
import { recurrenciesRoutes } from './modules/recurrency/recurrency.routes'
import { TestPage } from './modules/test/test.page';
import { AuthPage } from './modules/auth/auth.page';

const ORIGIN = '/auth'

export const routes: Routes = [
  { path: '', redirectTo: ORIGIN, pathMatch: 'full' },

  { path: 'home', component: HomePage },
  { path: 'recurrencies', component: RecurrencyPage, children: recurrenciesRoutes },
  { path: 'auth', component: AuthPage },
  { path: 'test', component: TestPage },

  { path: '**', redirectTo: ORIGIN, pathMatch: 'full' }
];

