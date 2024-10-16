import { Routes } from '@angular/router';
import { TestingPage } from './testing/forms--custom-ng-input/testing.page';

const ORIGIN = '/forms--custom-ng-input'

export const routes: Routes = [
  { path: '', redirectTo: ORIGIN, pathMatch: 'full' },

  { path: 'forms--custom-ng-input', component: TestingPage },

  { path: '**', redirectTo: ORIGIN, pathMatch: 'full' }
];
