import { Routes } from '@angular/router';

import { SettingsPage } from './settings/settings-page';
import { RecurrenciesPage } from './recurrencies/recurrencies-page';
import { TestingPage } from './testing/testing.page';


const ORIGIN = '/settings'

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: ORIGIN},
  { path: 'settings', component: SettingsPage },
  { path: 'recurrencies', component: RecurrenciesPage },
  { path: 'testing', component: TestingPage },
  // { path: 'brb', component: BrbListPage },
  // { path: 'testing', component: TestingPage },
  { path: '**', pathMatch: 'full', redirectTo: ORIGIN},
]

