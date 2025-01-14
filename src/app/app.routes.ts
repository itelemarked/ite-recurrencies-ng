import { Routes } from '@angular/router';

import { HomePage } from './pages/home.page';
import { RecurrencyListPage } from './pages/recurrency-list.page';
import { TestingPage } from './pages/testing.page';

const ORIGIN = '/testing'

export const routes: Routes = [
  { path: '', redirectTo: ORIGIN, pathMatch: 'full' },

  { path: 'home', component: HomePage },
  { path: 'recurrency-list', component: RecurrencyListPage },
  { path: 'testing', component: TestingPage},

  { path: '**', redirectTo: ORIGIN, pathMatch: 'full' }
];
