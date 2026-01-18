import { Routes } from '@angular/router';
import { RecurrencyListPage } from './recurrencies/recurrency-list.page';
import { TestingPage } from './testing/testing.page';


const ORIGIN = '/recurrencies'

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: ORIGIN},
  { path: 'recurrencies', component: RecurrencyListPage },
  { path: 'testing', component: TestingPage },
  // { path: 'brb', component: BrbListPage },
  // { path: 'settings', component: SettingsMainPage },
  // { path: 'testing', component: TestingPage },
  { path: '**', pathMatch: 'full', redirectTo: ORIGIN},
]

