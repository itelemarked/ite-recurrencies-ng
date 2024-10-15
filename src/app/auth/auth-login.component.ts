import { CommonModule } from '@angular/common';
import { Component, inject, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  IonButton,
  IonInput,
  IonItem,
  IonText,
} from '@ionic/angular/standalone';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-auth-login',
  standalone: true,
  imports: [
    IonButton,
    IonInput,
    IonItem,
    IonText,
    FormsModule,
    CommonModule,
  ],
  template: `
    <div>
      <ion-input
        type="email"
        email
        [(ngModel)]="emailValue"
        label="Email"
        label-placement="stacked"
        fill="outline"
        mode="md"
        placeholder="Enter email"
      ></ion-input>
    </div>

    <div class="ion-padding-top">
      <ion-input
        type="password"
        [minlength]="6"
        [(ngModel)]="passwordValue"
        label="Password"
        label-placement="stacked"
        fill="outline"
        mode="md"
        placeholder="Enter password"
      ></ion-input>
    </div>

    <div>
      <ion-button
        class="ion-padding-top"
        expand="block"
        (click)="onLogin()"
      >Login</ion-button>
    </div>

    <div class="flex ion-justify-content-center ion-align-items-center">
      <span>No account yet?</span>
      <ion-button
        fill="clear"
        [strong]="true"
        color="primary"
        (click)="toggle.emit()"
        >Signup</ion-button
      >
    </div>
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
export class AuthLoginComponent {

  // DEPENDENCIES
  authService = inject(AuthService)

  // OUTPUTS
  toggle = output()

  // TEMPLATE VARS
  emailValue = ''
  passwordValue = ''

  onLogin() {
    // TODO: validate email and password
    this.authService.login(this.emailValue, this.passwordValue)
  }
}
