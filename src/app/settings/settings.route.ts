import { Route } from "@angular/router";
import { SettingsPage } from "./settings.page";

export const settingsRoute: Route[] = [
  { path: '', component: SettingsPage },
  { path: 'dateFormat', loadChildren: () => import('./dateFormat/dateFormat.route').then(m => m.dateFormatRoute)}
  // { path: 'dateFormat', loadComponent: () => import('./pages/dateFormat.page').then(m => m.DateFormatPage)}
]