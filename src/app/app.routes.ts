import { Routes } from '@angular/router';
import { HomePage } from './pages/home.page';
import { RecurrencyListPage } from './pages/recurrency-list';

const ORIGIN = '/recurrency-list'

export const routes: Routes = [
  { path: '', redirectTo: ORIGIN, pathMatch: 'full' },

  { path: 'home', component: HomePage },
  { path: 'recurrency-list', component: RecurrencyListPage },

  { path: '**', redirectTo: ORIGIN, pathMatch: 'full' }
];
