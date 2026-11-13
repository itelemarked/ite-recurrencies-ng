import { Routes } from '@angular/router';

import { TestingPage } from './features/testing/testing.page';

const ORIGIN = '/testing'

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: ORIGIN},
  { path: 'testing', component: TestingPage },
  { path: '**', pathMatch: 'full', redirectTo: ORIGIN},
]

