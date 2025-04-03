import { Routes } from '@angular/router';

const ORIGIN = '/testing'

export const appRoutes: Routes = [
  { path: '', redirectTo: ORIGIN, pathMatch: 'full' },

  { path: 'tabs', loadChildren: ()=> import('./tabs/tabs.route').then(m => m.tabsRoute) },
  // { path: 'auth', loadChildren: () => import('./auth/auth.routes').then(m => m.AuthRoutes)},
  // { path: 'testing', component: TestingPage},
  { path: 'testing', loadComponent: () => import('./testing/testing.page').then(m => m.TestingPage)},

  { path: 'settings', loadChildren: () => import('./settings/settings.route').then(m => m.settingsRoute)},

  { path: '**', redirectTo: ORIGIN, pathMatch: 'full' }
];
