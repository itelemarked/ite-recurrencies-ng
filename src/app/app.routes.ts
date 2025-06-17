import { Routes } from '@angular/router';

import { TabsPage } from './pages/tabs/tabs.page';
import { HomePage } from './pages/tabs/pages/home/home.page';
import { RecurrenciesPage } from './pages/tabs/pages/recurrencies/recurrencies.page';
import { BrbPage } from './pages/tabs/pages/brb/brb.page';

import { SettingsPage } from './pages/settings/settings.page';
import { DateformatOptionsPage } from './pages/settings/pages/dateformat-options/dateformat-options.page';
import { TimezoneOptionsPage } from './pages/settings/pages/timezone-options/timezone-options.page';
import { AuthenticatePage } from './pages/settings/pages/authenticate/authenticate.page';

import { TestingPage } from './pages/testing/testing.page';


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

export const routes: Routes = [
  { path: '', redirectTo: ORIGIN, pathMatch: 'full' },

  { path: 'tabs', component: TabsPage, children: [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', component: HomePage },
    { path: 'recurrencies', component: RecurrenciesPage },
    { path: 'brb', component: BrbPage },
    { path: '**', redirectTo: 'home', pathMatch: 'full' }
  ]},

  { path: 'settings', children: [
    { path: '', component: SettingsPage },
    { path: 'dateformat-options', component: DateformatOptionsPage },
    { path: 'timezone-options', component: TimezoneOptionsPage },
    { path: 'authenticate', component: AuthenticatePage },
    { path: '**', redirectTo: '', pathMatch: 'full' }
  ]},

  { path: 'testing', component: TestingPage },
  
  { path: '**', redirectTo: ORIGIN, pathMatch: 'full' }
];

