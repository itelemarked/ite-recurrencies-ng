import { Routes } from '@angular/router';
import { HomePage } from './modules/home/home.page';
import { ListPage } from './modules/recurrency/recurrency-list.page';

const ORIGIN = '/home'

export const routes: Routes = [
  { path: '', redirectTo: ORIGIN, pathMatch: 'full' },

  { path: 'home', component: HomePage },
  { path: 'recurrency', component: ListPage },

  { path: '**', redirectTo: ORIGIN, pathMatch: 'full' }
];
