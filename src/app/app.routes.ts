import { Routes } from '@angular/router';
import { TestingPage } from './testing/testing.page';
import { RecurrencyListPage } from './recurrencies2/pages/recurrency-list-page/recurrency-list-page';


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

