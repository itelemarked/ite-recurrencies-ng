import { Component, inject } from '@angular/core';
import { IonContent, IonHeader, IonInput, IonSpinner, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';

import { AngularFirestore } from '@angular/fire/compat/firestore';
import { RecurrencyService } from '../services/recurrency.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AuthService } from '../services/auth.service';
import { AuthLoginSignupComponent } from '../components/auth-login-signup.component';
import { AuthLogoutComponent } from '../components/auth-logout.component';
import { BehaviorSubject, ReplaySubject, take } from 'rxjs';
import { AuthInputControlComponent } from '../components/auth-input-control.component';

@Component({
  selector: 'app-testing',
  standalone: true,
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonSpinner,
    AuthLoginSignupComponent,
    AuthLogoutComponent,
    AuthInputControlComponent,
  ],
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>TESTING</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content [forceOverscroll]="false" class="ion-padding">
      <!-- <div *ngIf="this.authService.isLoading$ | async"><ion-spinner/></div>
      <ng-container *ngIf="(this.authService.user$$|async) !== null; then logout else loginSignup"/>

      <ng-template #logout>
        <app-auth-logout></app-auth-logout>
      </ng-template>

      <ng-template #loginSignup>
        <app-auth-login-signup></app-auth-login-signup>
      </ng-template> -->

      <!-- <div style="border: 1px solid green; padding: 5px;">
        <div style="color: green; margin-bottom: 10px; font-size: 0.75em;">Show spinner when loading user</div>
        <div *ngIf="this.authService.isLoading$ | async">
          <ion-spinner/>
        </div>
      </div> -->
      
      <div style="border: 1px solid green; padding: 5px; margin-top: 10px;">
        <div style="color: green; margin-bottom: 10px; font-size: 0.75em;">app-auth-login-signup component:</div>
        <app-auth-login-signup></app-auth-login-signup>
      </div>

      <div style="border: 1px solid green; padding: 5px; margin-top: 10px;">
        <div style="color: green; margin-bottom: 10px; font-size: 0.75em;">app-auth-logout component:</div>
        <app-auth-logout></app-auth-logout>
      </div>


    </ion-content>
  `,
  styles: ``,
})
export class TestingPage {

  firestore = inject(AngularFirestore)
  fireauth = inject(AngularFireAuth)
  recurrencyService = inject(RecurrencyService)
  authService = inject(AuthService)

  constructor() {
    this.TEST()
    this.recurrencyService.TEST()
    this.authService.TEST()
  }

  TEST() {

  }

} 