import { Route } from "@angular/router";

export const homeRoute: Route[] = [
  { path: '', loadComponent: () => import('./home.page').then(m => m.HomePage) }
]