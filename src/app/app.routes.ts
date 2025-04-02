import { Routes } from '@angular/router';
import { TabsPage } from './pages/tabs.page';
import { TabsHomePage } from './pages/tabsHome.page';
import { TabsRecurrenciesPage } from './pages/tabsRecurrencies.page';

const ORIGIN = '/testing'

export const routes: Routes = [
  { path: '', redirectTo: ORIGIN, pathMatch: 'full' },

  { path: 'tabs', component: TabsPage, children: [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', component: TabsHomePage },
    { path: 'recurrencies', component: TabsRecurrenciesPage },
    { path: '**', redirectTo: 'home', pathMatch: 'full' },
  ]},
  // { path: 'auth', loadChildren: () => import('./auth/auth.routes').then(m => m.AuthRoutes)},
  // { path: 'testing', component: TestingPage},
  { path: 'testing', loadComponent: () => import('./pages/testing.page').then(m => m.TestingPage)},
  
  
  { path: '**', redirectTo: ORIGIN, pathMatch: 'full' }
];
