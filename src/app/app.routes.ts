import { Routes } from '@angular/router';
import { RecurrencyListPage } from './recurrencies/_pages/recurrency-list';
import { BrbListPage } from './brb/_pages/brb-list';
import { SettingsMainPage } from './settings/_pages/settings-main';

const ORIGIN = '/recurrencies'

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: ORIGIN},
  { path: 'recurrencies', component: RecurrencyListPage },
  { path: 'brb', component: BrbListPage },
  { path: 'settings', component: SettingsMainPage },
  { path: '**', pathMatch: 'full', redirectTo: ORIGIN},
]

