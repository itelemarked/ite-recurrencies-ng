import { Component, inject } from '@angular/core';
import { IonButton, IonContent, IonHeader, IonInput, IonSpinner, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';

import { toSignal } from '@angular/core/rxjs-interop';

import { AngularFirestore } from '@angular/fire/compat/firestore';
import { RecurrencyService } from '../services/recurrency.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AuthService } from '../services/auth.service';
import { AuthLoginSignupComponent } from '../components/auth-login-signup.component';
import { AuthLogoutComponent } from '../components/auth-logout.component';
import { BehaviorSubject, ReplaySubject, Subject, take } from 'rxjs';
import { AuthInputControlComponent } from '../components/auth-input-control.component';
import { SettingsService } from '../services/settings.service';
import { RecurrencyListComponent } from '../components/recurrency-list.component';

@Component({
  selector: 'app-testing',
  standalone: true,
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButton,
    AuthLoginSignupComponent,
    AuthLogoutComponent,
    RecurrencyListComponent,
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


      <div class="test-container">
        <div class="test-container-title">recurrencies</div>
        <app-recurrency-list></app-recurrency-list>
      </div>

      <div class="test-container">
        <div class="test-container-title">settings</div>
        <div>timezone: {{ (this.settingsService.settings$$ | async)?.timezone }}</div> 
      </div>
      
      <div class="test-container">
        <div class="test-container-title">auth</div>
        <app-auth-logout *ngIf="(this.authService.user$$ | async) !== null"></app-auth-logout>
        <app-auth-login-signup *ngIf="(this.authService.user$$ | async) === null"></app-auth-login-signup>
      </div>


    </ion-content>
  `,
  styles: `
    .test-container {
      border: 1px solid var(--ion-color-primary);
      padding: 5px; 
      margin-top: 10px;
    }

    .test-container-title {
      color: var(--ion-color-primary);
      margin-bottom: 10px; 
      font-size: 0.75em;
    }
  `,
})
export class TestingPage {

  firestore = inject(AngularFirestore)
  fireauth = inject(AngularFireAuth)
  recurrencyService = inject(RecurrencyService)
  authService = inject(AuthService)
  settingsService = inject(SettingsService)


  settingsTimezone = ''



  constructor() {
    this.TEST()
    this.recurrencyService.TEST()
    this.authService.TEST()
    this.settingsService.TEST()
  }

  
  // count = 0
  // testingToSignal$ = new BehaviorSubject<number>(0)
  // testingToSignalSig = toSignal(this.testingToSignal$, {initialValue: 99})

  // onTestingToSignal() {
  //   this.count++
  //   this.testingToSignal$.next(this.count)
  //   console.log(`count: ${this.count}`)
  //   console.log(`testingToSignalSig: ${this.testingToSignalSig()}`)
  // }

  TEST() {
    // console.log(`count: ${this.count}`)
    // console.log(`testingToSignalSig: ${this.testingToSignalSig()}`)
  }

} 