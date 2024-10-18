import { Routes } from '@angular/router';
import { TestingPage } from './testing/testing.page';

const ORIGIN = '/testing'

export const routes: Routes = [
  { path: '', redirectTo: ORIGIN, pathMatch: 'full' },

  { path: 'testing', component: TestingPage },

  { path: '**', redirectTo: ORIGIN, pathMatch: 'full' }
];
