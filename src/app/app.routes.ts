import { Routes } from '@angular/router';

import { TestingPage } from './pages/testing/testing.page';

import { TabsPage } from './pages/tabs/tabs.page';
import { HomePage } from './pages/tabs/pages/home/home.page';
import { RecurrenciesPage } from './pages/tabs/pages/recurrencies/recurrencies.page';

import { SettingsPage } from './pages/settings/settings.page';
import { AuthenticatePage } from './pages/settings/pages/authenticate/authenticate.page';
import { DateFormatPage } from './pages/settings/pages/dateFormat/dateFormat.page';


/**
 * All routing in one file in the root app folder for better SA.
 * 
 *  - consider lazy loading of specific routes, if loading this routes requires long loading time...
 *  - use children instead of nested path: eg. prefer { path: 'settings', children: [ {path: 'xyz', (...) }]} instead of {path: 'settings/xyz', (...)} for better SA.
 *  - pages should be "smart", components should be "dumb"
 *  - pages navigation should be implemented in pages (which should be smart...) and not in components (which should be dumb...)
 *  - folder stucture: paths should match nested "pages folder". E.g path to '/settings/xyz' should match "/app/pages/settings/pages/xyz/xyz.page.ts"
 *  - consider redirects and wildcard routes in the children paths
 */



const ORIGIN = '/testing'

export const appRoutes: Routes = [
  { path: '', redirectTo: ORIGIN, pathMatch: 'full' },

  { path: 'testing', component: TestingPage },

  { path: 'tabs', component: TabsPage, children: [
    { path: '', redirectTo: 'home', pathMatch: 'full'},
    { path: 'home', component: HomePage },
    { path: 'recurrencies', component: RecurrenciesPage }
    // { path: 'recurrencies', loadComponent: () => import('./pages/tabs/pages/recurrencies/recurrencies.page').then(m => m.RecurrenciesPage) }  // consider lazy-loading
  ]},

  { path: 'settings', children: [
    { path: '', component: SettingsPage },
    { path: 'authenticate', component: AuthenticatePage },
    { path: 'dateFormat', component: DateFormatPage },
    { path: '**', redirectTo: '', pathMatch: 'full'}
  ]},

  { path: '**', redirectTo: ORIGIN, pathMatch: 'full' }
];

