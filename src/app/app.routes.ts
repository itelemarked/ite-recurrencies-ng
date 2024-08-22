import { Routes } from '@angular/router';
import { HomePage } from './modules/home/home.page';

const ORIGIN = '/home'

export const routes: Routes = [
  { path: '', redirectTo: ORIGIN, pathMatch: 'full' },

  { path: 'home', component: HomePage },

  { path: '**', redirectTo: ORIGIN, pathMatch: 'full' }
];
