import { CommonModule } from '@angular/common';
import { Component, inject, output } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import {
  IonButton,
  IonIcon,
  IonInput,
  IonItem,
  IonText,
} from '@ionic/angular/standalone';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-auth-login-signup',
  standalone: true,
  imports: [
    IonButton,
    IonInput,
    IonText,
    FormsModule,
    CommonModule,
    ReactiveFormsModule
  ],
  template: `
    <form class="form" [formGroup]="form" (ngSubmit)="onSubmit($event)">

      <!-- Email control -->
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

      <!-- Password control -->
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

      <!-- Confirm password control -->
      <div *ngIf="loginSignupState === 'signup'">
        <div class="ion-padding-top">

          <!-- TODO: disable if password is not valid -->
          <ion-input
            class="input"
            type="password"
            label="Confirm password"
            label-placement="stacked"
            fill="outline"
            mode="md"
            placeholder="Confirm password"
            [formControl]="confirmPasswordCtl"
          >
          </ion-input>

          <div class="m-1 px text-xs">
            <ion-text color="danger" class="block" *ngIf="confirmPasswordCtl.touched && confirmPasswordCtl.hasError('required')">Password confirmation required...</ion-text>
            <ion-text color="danger" class="block" *ngIf="confirmPasswordCtl.touched && form.hasError('passwordMissmatch')">Password confirmation failed...</ion-text>
          </div>
        </div>
      </div>

      <!-- Submit button -->
      <div>
        <ion-button type="submit" class="ion-padding-top" expand="block">
          @if (loginSignupState === 'login') {
            Login
          } @else {
            Signup
          }
        </ion-button>
      </div>

      <!-- Login-signup state comments -->
      <div class="flex ion-justify-content-center ion-align-items-center">
        <span>
          @if (loginSignupState === 'login') {
            No account yet?
          } @else {
            Already have an account?
          }
        </span>
        <ion-button fill="clear" [strong]="true" color="primary" (click)="onToggleLoginSignup()">
          @if (loginSignupState === 'login') {
            Signup
          } @else {
            Login
          }
        </ion-button>
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

export class AuthLoginSignupComponent {

  // DEPENDENCIES
  auth = inject(AuthService)


  // OUTPUTS
  login = output()
  signup = output()
  


  // VARS
  loginSignupState: 'login' | 'signup' = 'signup'
  emailCtl = new FormControl('', {
    validators: [Validators.required, Validators.email],
    // updateOn: 'blur'
  })
  passwordCtl = new FormControl('aA@', {
    validators: [
      Validators.required,
      minLengthValidator(6),
      hasRegexValidator(/[0-9]+/, 'numericCharacter'),
      hasRegexValidator(/[a-z]+/, 'lowerCaseCharacter'),
      hasRegexValidator(/[A-Z]+/, 'upperCaseCharacter'),
      hasRegexValidator(/[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]+/, 'specialCharacter'),
    ],
    // updateOn: 'blur'
  })
  confirmPasswordCtl = new FormControl({
    value: '',
    disabled: true
  }, {
    validators: Validators.required
  })

  form = new FormGroup({
    emailCtl: this.emailCtl,
    passwordCtl: this.passwordCtl,
    confirmPasswordCtl: this.confirmPasswordCtl
  }, {
    validators: passwordMissmatchValidator
  })


  // INIT
  constructor() {
    this.passwordCtl.valueChanges.subscribe(_ => {
      if (this.passwordCtl.valid) {
        this.confirmPasswordCtl.enable()
      } else {
        this.confirmPasswordCtl.disable()
      }
    })
  }


  // UTILS


  // ACTIONS
  onSubmit(e: SubmitEvent) {
    this.form.markAllAsTouched()
  }
  onToggleLoginSignup() {
    const state = this.loginSignupState
    this.loginSignupState = state === 'login' ? 'signup' : 'login'
    this.form.markAsUntouched()
  }
}


const minLengthValidator = (min: number): ValidatorFn => (control: AbstractControl) => {
  if (control.value.length >= min) return null
  return { minLength: true }
}

const hasRegexValidator = (regex: RegExp, errorKey: string) => (control: AbstractControl) => {
  const isValid = regex.test(control.value)
  return isValid ? null : { [errorKey]: true }
} 

const equals = (value: string): ValidatorFn => (control: AbstractControl) => {
  // Doesn't work, because the 'value' argument is not updated, it takes always the initial value of the corresponding control!!
  // For crossvalidation, the validator must be set on the parent group.
  console.log(value)
  if (control.value === value) return null
  return { equals: true }
}

const passwordMissmatchValidator = (control: AbstractControl) => {
  const password = control.get('passwordCtl')!.value
  const confirmPassword = control.get('confirmPasswordCtl')!.value
  if (confirmPassword.trim() === '' || password === confirmPassword) return null
  return { passwordMissmatch: true }
}