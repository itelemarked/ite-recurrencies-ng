import { Routes } from '@angular/router';

import { RecurrencyListPage } from './recurrencies/_pages/recurrency-list.page';
import { BrbListPage } from './brb/_pages/brb-list';
import { SettingsMainPage } from './settings/_pages/settings-main';
import { TestingPage } from './testing/testing.page';

const ORIGIN = '/recurrencies'

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: ORIGIN},
  { path: 'recurrencies', component: RecurrencyListPage },
  { path: 'brb', component: BrbListPage },
  { path: 'settings', component: SettingsMainPage },
  { path: 'testing', component: TestingPage },
  { path: '**', pathMatch: 'full', redirectTo: ORIGIN},
]

