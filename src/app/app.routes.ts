import { Routes } from '@angular/router';

import { TestingPage } from './testing/testing.page';

const ORIGIN = '/testing'

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: ORIGIN},
  { path: 'testing', component: TestingPage },
  { path: '**', pathMatch: 'full', redirectTo: ORIGIN},
]

