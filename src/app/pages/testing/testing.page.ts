
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';

import { AuthService } from '@shared/services/auth.service';



@Component({
  selector: 'app-testing',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
  ],
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>Testing</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content [forceOverscroll]="false" class="p-xl">

      <div>user email: {{this.AuthService.user()?.email }}</div>
      <div>user is loading: {{this.AuthService.isLoading() }}</div>
      <div>user is logged-in: {{this.AuthService.isLoggedIn() }}</div>
      <div>user is logged-out: {{this.AuthService.isLoggedOut() }}</div>

    </ion-content>
  `,
  styles: ``,
})
export class TestingPage {

  AuthService = inject(AuthService)

  constructor() {

  }

}
