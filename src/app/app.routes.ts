import { Routes } from '@angular/router';

import { TabHomePage } from './pages/tab-home.page';
import { TabRecurrenciesPage } from './pages/tab-recurrencies.page';
import { TestingPage } from './pages/testing.page';
import { TabsPage } from './pages/tabs.page';
import { TabBrbComponent } from './pages/tab-brb.page';

const ORIGIN = '/testing'

export const routes: Routes = [
  { path: '', redirectTo: ORIGIN, pathMatch: 'full' },

  { path: 'tabs', component: TabsPage, children: [
    { path: 'home', component: TabHomePage },
    { path: 'recurrencies', component: TabRecurrenciesPage },
    { path: 'brb', component: TabBrbComponent }
  ]},
  { path: 'testing', component: TestingPage},
  
  { path: '**', redirectTo: ORIGIN, pathMatch: 'full' }
];
