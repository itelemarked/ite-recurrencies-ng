import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonButton, IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { AuthService } from './auth.service';
import { Observable, map } from 'rxjs';
import { AuthLogoutComponent } from './auth-logout.component';
import { AuthLoginSignupComponent } from './auth-login-signup.component';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    FormsModule,
    CommonModule,
    AuthLoginSignupComponent,
    AuthLogoutComponent
  ],
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>Auth</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding" [forceOverscroll]="false">

      <!-- <ng-container *ngIf="!(isLoggedIn | async) && loginSignup === 'login'">
        <app-auth-login
          (toggle)="loginSignup = 'signup'"
        ></app-auth-login>
      </ng-container>

      <ng-container *ngIf="!(isLoggedIn | async) && loginSignup === 'signup'">
        <app-auth-signup
          (toggle)="loginSignup = 'login'"
        ></app-auth-signup>
      </ng-container> -->

      <ng-container *ngIf="!(isLoggedIn | async)">
        <app-auth-login-signup></app-auth-login-signup>
      </ng-container>

      <ng-container *ngIf="isLoggedIn | async">
        <app-auth-logout></app-auth-logout>
      </ng-container>

    </ion-content>
  `,
  styles: `

    ion-input {
      --highlight-color: var(--ion-color-dark);
      --highlight-color-valid: var(--ion-color-dark);
    }

    ion-button {
      --border-radius: 5px;
    }

    .flex {
      display: flex;
    }

  `,
})
export class AuthPage {

  isLoggedIn = this._initIsLoggedIn()
  loginSignup: 'login' | 'signup' = 'signup'

  constructor(private auth: AuthService) {}
  
  private _initIsLoggedIn(): Observable<boolean> {
    return this.auth.user$.pipe(
      map(usr => !!usr)
    )
  }

} 