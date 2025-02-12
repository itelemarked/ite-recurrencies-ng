import { Routes } from '@angular/router';

import { TabHomePage } from './pages/tab-home.page';
import { TabRecurrenciesPage } from './pages/tab-recurrencies.page';
import { TestingPage } from './pages/testing.page';
import { TabsPage } from './pages/tabs.page';
import { TabBrbComponent } from './pages/tab-brb.page';
import { SettingsPage } from './pages/settings.page';
import { SettingsDateformatPage } from './pages/settings-dateformat';
import { SettingsTimezonePage } from './pages/settings-timezone';
import { SettingsLoginSignupPage } from './pages/settings-login-signup';

const ORIGIN = '/tabs'

export const routes: Routes = [
  { path: '', redirectTo: ORIGIN, pathMatch: 'full' },

  { path: 'tabs', component: TabsPage, children: [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', component: TabHomePage },
    { path: 'recurrencies', component: TabRecurrenciesPage },
    { path: 'brb', component: TabBrbComponent },
    { path: '**', redirectTo: 'home', pathMatch: 'full' }
  ]},

  { path: 'settings', component: SettingsPage },
  { path: 'settings/dateformat', component: SettingsDateformatPage },
  { path: 'settings/timezone', component: SettingsTimezonePage },
  { path: 'settings/login', component: SettingsLoginSignupPage },

  { path: 'testing', component: TestingPage },
  
  { path: '**', redirectTo: ORIGIN, pathMatch: 'full' }
];
