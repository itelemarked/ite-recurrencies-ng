import { CommonModule } from '@angular/common';
import { Component, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  IonButton,
  IonInput,
  IonItem,
  IonText,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-auth-signup',
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
        ngModel
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
        ngModel
        label="Password"
        label-placement="stacked"
        fill="outline"
        mode="md"
        placeholder="Enter password"
      ></ion-input>
    </div>

    <div class="ion-padding-top">
      <ion-input
        type="password"
        [minlength]="6"
        ngModel
        label="Confirm password"
        label-placement="stacked"
        fill="outline"
        mode="md"
        placeholder="Confirm password"
      ></ion-input>
    </div>

    <div>
      <ion-button class="ion-padding-top" expand="block">Signup</ion-button>
    </div>

    <div class="flex ion-justify-content-center ion-align-items-center">
      <span>Already have an account?</span>
      <ion-button
        fill="clear"
        [strong]="true"
        color="primary"
        (click)="toggle.emit()"
        >Login</ion-button
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
export class AuthSignupComponent {

  toggle = output()

  constructor() {}
}
