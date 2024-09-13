import { Routes } from '@angular/router';
import { HomePage } from './home/home.page';
import { TestPage } from './test/test.page';
import { AuthPage } from './auth/auth.page';
import { RecurrencyPage } from './recurrency/recurrency.page';
import { recurrenciesRoutes } from './recurrency/recurrency.routes';

const ORIGIN = '/auth'

export const routes: Routes = [
  { path: '', redirectTo: ORIGIN, pathMatch: 'full' },

  { path: 'home', component: HomePage },
  { path: 'recurrencies', component: RecurrencyPage, children: recurrenciesRoutes },
  { path: 'auth', component: AuthPage },
  { path: 'test', component: TestPage },

  { path: '**', redirectTo: ORIGIN, pathMatch: 'full' }
];

