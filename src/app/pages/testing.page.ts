import { Component, inject } from '@angular/core';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';

import { AngularFirestore } from '@angular/fire/compat/firestore';
import { RecurrencyService } from '../services/recurrency.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { UserService } from '../services/user.service';
import { AuthLoginSignupComponent } from '../components/auth-login-signup.component';
import { AuthLogoutComponent } from '../components/auth-logout.component';
import { BehaviorSubject, ReplaySubject, take } from 'rxjs';

@Component({
  selector: 'app-testing',
  standalone: true,
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    AuthLoginSignupComponent,
    AuthLogoutComponent
  ],
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>TESTING</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content [forceOverscroll]="false" class="ion-padding">
      <!-- <p>Testing works!</p> -->
      <div *ngIf="this.userService.isLoading$ | async">Loading...</div>
      <ng-container *ngIf="(this.userService.user$$|async) !== null; then logout else loginSignup"/>

      <ng-template #logout>
        <app-auth-logout></app-auth-logout>
      </ng-template>
      <ng-template #loginSignup>
        <app-auth-login-signup></app-auth-login-signup>
      </ng-template>
    </ion-content>
  `,
  styles: ``,
})
export class TestingPage {

  firestore = inject(AngularFirestore)
  fireauth = inject(AngularFireAuth)
  recurrencyService = inject(RecurrencyService)
  userService = inject(UserService)

  constructor() {
    this.TEST()
    this.recurrencyService.TEST()
    this.userService.TEST()
  }

  TEST() {

  }

} 