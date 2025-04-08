import { Routes } from '@angular/router';

import { TabsHomePage } from './pages/tabs/home/home.page';
import { TabsRecurrenciesPage } from './pages/tabs/recurrencies/recurrencies.page';
import { TestingPage } from './pages/testing/testing.page';
import { TabsPage } from './pages/tabs/tabs.page';
import { TabsBrbComponent } from './pages/tabs/brb/brb.page';
import { SettingsPage } from './pages/settings/settings.page';
import { SettingsDateformatOptionsPage } from './pages/settings-dateformat-options/settings-dateformat-options.page';
import { SettingsTimezoneOptionsPage } from './pages/settings-timezone-options/settings-timezone-options.page';
import { SettingsAuthenticatePage } from './pages/settings-authenticate/settings-authenticate.page';

const ORIGIN = '/testing'

export const routes: Routes = [
  { path: '', redirectTo: ORIGIN, pathMatch: 'full' },

  { path: 'tabs', component: TabsPage, children: [
    { path: '', redirectTo: 'home', pathMatch: 'full' },

    { path: 'home', component: TabsHomePage },
    { path: 'recurrencies', component: TabsRecurrenciesPage },
    { path: 'brb', component: TabsBrbComponent },

    { path: '**', redirectTo: 'home', pathMatch: 'full' }
  ]},

  { path: 'settings', component: SettingsPage },
  { path: 'settings-dateformat-options', component: SettingsDateformatOptionsPage },
  { path: 'settings-timezone-options', component: SettingsTimezoneOptionsPage },
  { path: 'settings-authenticate', component: SettingsAuthenticatePage },

  { path: 'testing', component: TestingPage },
  
  { path: '**', redirectTo: ORIGIN, pathMatch: 'full' }
];

