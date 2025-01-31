import { Routes } from '@angular/router';

import { TabHomePage } from './pages/tab-home.page';
import { TabRecurrenciesPage } from './pages/tab-recurrencies.page';
import { TabTestingPage } from './pages/tab-testing.page';
import { TabsPage } from './pages/tabs.page';

const ORIGIN = '/tabs'

export const routes: Routes = [
  { path: '', redirectTo: ORIGIN, pathMatch: 'full' },

  { path: 'tabs', component: TabsPage, children: [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', component: TabHomePage },
    { path: 'recurrencies', component: TabRecurrenciesPage },
    { path: 'testing', component: TabTestingPage},
    { path: '**', redirectTo: 'home', pathMatch: 'full' }
  ]},
  
  { path: '**', redirectTo: ORIGIN, pathMatch: 'full' }
];
