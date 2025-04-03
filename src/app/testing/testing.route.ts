import { Route } from "@angular/router";

export const testingRoute: Route[] = [
  { path: '', loadComponent: () => import('./testing.page').then(m => m.TestingPage) }
]