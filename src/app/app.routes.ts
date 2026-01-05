import { Routes } from '@angular/router';
import { RecurrencyListPage } from './recurrencies/recurrency-list.page';


const ORIGIN = '/recurrencies'

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: ORIGIN},
  { path: 'recurrencies', component: RecurrencyListPage },
  // { path: 'brb', component: BrbListPage },
  // { path: 'settings', component: SettingsMainPage },
  // { path: 'testing', component: TestingPage },
  { path: '**', pathMatch: 'full', redirectTo: ORIGIN},
]

