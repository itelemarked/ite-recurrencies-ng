import { Routes } from '@angular/router';
import { TestingPage } from './testing/testing.page';
import { RecurrenciesPage } from './recurrencies3/recurrencies-page';


const ORIGIN = '/recurrencies'

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: ORIGIN},
  { path: 'recurrencies', component: RecurrenciesPage },
  { path: 'testing', component: TestingPage },
  // { path: 'brb', component: BrbListPage },
  // { path: 'settings', component: SettingsMainPage },
  // { path: 'testing', component: TestingPage },
  { path: '**', pathMatch: 'full', redirectTo: ORIGIN},
]

