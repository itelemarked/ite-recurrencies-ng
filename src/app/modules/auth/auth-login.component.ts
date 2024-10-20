import { CommonModule } from '@angular/common';
import { Component, computed, inject, output, signal } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import {
  IonButton,
  IonIcon,
  IonInput,
  IonItem,
  IonText,
} from '@ionic/angular/standalone';
import { AuthService } from './auth.service';
import { addIcons } from 'ionicons';
import { eye } from 'ionicons/icons';

@Component({
  selector: 'app-auth-login',
  standalone: true,
  imports: [
    IonButton,
    IonIcon,
    IonInput,
    IonItem,
    IonText,
    FormsModule,
    CommonModule,
    ReactiveFormsModule
  ],
  template: `
    <form class="form" [formGroup]="form" (ngSubmit)="onSubmit($event)">

      <div>
        <ion-input
          class="input"
          type="email"
          label="Email"
          label-placement="stacked"
          fill="outline"
          mode="md"
          placeholder="Enter email"
          [formControl]="emailCtl"
        />
        <div class="m-1 px text-xs">
           <ion-text color="danger" class="block" *ngIf="emailCtl.touched && emailCtl.hasError('required')">Enter an email...</ion-text>
           <ion-text color="danger" class="block" *ngIf="emailCtl.touched && emailCtl.hasError('email')">Invalid email...</ion-text>
        </div>
      </div>

      <div class="ion-padding-top">
        <ion-input
          class="input"
          type="password"
          label="Password"
          label-placement="stacked"
          fill="outline"
          mode="md"
          placeholder="Enter password"
          [formControl]="passwordCtl"
        >
        </ion-input>
        <div class="m-1 px text-xs">
           <ion-text color="danger" class="block" *ngIf="passwordCtl.touched && passwordCtl.hasError('required')">Enter a password...</ion-text>
           <ion-text color="danger" class="block" *ngIf="passwordCtl.touched && passwordCtl.hasError('minLength')">Is not at least 6 characters long...</ion-text>
           <ion-text color="danger" class="block" *ngIf="passwordCtl.touched && passwordCtl.hasError('lowerCaseCharacter')">Lower case character missing...</ion-text>
           <ion-text color="danger" class="block" *ngIf="passwordCtl.touched && passwordCtl.hasError('upperCaseCharacter')">Upper case character missing...</ion-text>
           <ion-text color="danger" class="block" *ngIf="passwordCtl.touched && passwordCtl.hasError('specialCharacter')">Special character missing...</ion-text>
           <ion-text color="danger" class="block" *ngIf="passwordCtl.touched && passwordCtl.hasError('numericCharacter')">Numeric character missing...</ion-text>
        </div>
      </div>

      <div>
        <ion-button type="submit" class="ion-padding-top" expand="block" [disabled]="form.untouched || form.invalid">
          Login
        </ion-button>
      </div>

      <div class="flex ion-justify-content-center ion-align-items-center">
        <span>No account yet?</span>
        <ion-button fill="clear" [strong]="true" color="primary" (click)="toggleLoginSignup.emit()">
          Signup
        </ion-button
        >
      </div>
    </form>
  `,
  styles: `

    ion-input {
      --highlight-color: var(--ion-color-dark);
      --highlight-color-valid: var(--ion-color-dark);
    }

    ion-button {
      --border-radius: 5px;
    }

  `,
})

export class AuthLoginComponent {

  // DEPENDENCIES
  auth = inject(AuthService)


  // OUTPUTS
  login = output()
  toggleLoginSignup = output()


  // VARS
  emailCtl = new FormControl('', {
    validators: [Validators.required, Validators.email],
    // updateOn: 'blur'
  })
  passwordCtl = new FormControl('', {
    validators: [
      Validators.required,
      minLengthValidator(6),
      hasRegex(/[0-9]+/, 'numericCharacter'),
      hasRegex(/[a-z]+/, 'lowerCaseCharacter'),
      hasRegex(/[A-Z]+/, 'upperCaseCharacter'),
      hasRegex(/[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]+/, 'specialCharacter'),
    ],
    // updateOn: 'blur'
  })

  form = new FormGroup({
    emailCtl: this.emailCtl,
    passwordCtl: this.passwordCtl
  })


  // INIT
  constructor() {}


  // UTILS


  // ACTIONS
  onSubmit(e: SubmitEvent) {}
}


const minLengthValidator = (min: number): ValidatorFn => (control: AbstractControl) => {
  if (control.value.length >= min) return null
  return { minLength: true }
}

const hasRegex = (regex: RegExp, errorKey: string) => (control: AbstractControl) => {
  const isValid = regex.test(control.value)
  return isValid ? null : { [errorKey]: true }
} 

