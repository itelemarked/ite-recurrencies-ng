import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

import { IonButton, IonText } from '@ionic/angular/standalone';

import { UserService } from '../services/user.service';
import { AuthInputControlComponent } from './auth-input-control.component';


@Component({
  selector: 'app-auth-login-signup',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    IonButton,
    IonText,
    AuthInputControlComponent
  ],
  template: `

    <!-- AUTH ERRORS -->
    <div 
      *ngIf="errorMessages().length > 0"
      class="ite-auth-errors p-sm mb-lg"
    >
      <div *ngFor="let err of errorMessages()">{{ err }}</div>
    </div>

    <form class="form" [formGroup]="form" (ngSubmit)="onSubmit()">

      <!-- EMAIL CTL -->
      <app-auth-input-control
        class="ite-email-ctl"
        type="text"
        label="Email"
        [formControl]="emailCtl"
      >
        <div *ngIf="emailCtl.touched && emailCtl.hasError('email')">Invalid email...</div>
        <div *ngIf="emailCtl.touched && emailCtl.hasError('required')">Email required...</div>
      </app-auth-input-control>

      <!-- PASSWORD CTL -->
      <app-auth-input-control
        class="ite-password-ctl ion-margin-top"
        [ngClass]="{'ite-password-missmatch': passwordMissmatch()}"
        type="password"
        label="Password"
        [formControl]="passwordCtl"
      >
        <div *ngIf="passwordCtl.touched && passwordCtl.hasError('required')">Password required...</div>
        <div *ngIf="passwordCtl.touched && passwordCtl.hasError('minlength')">Must be at least 6 characters long...</div>
        <div *ngIf="passwordCtl.touched && passwordCtl.hasError('numericCharacter')">Numeric character missing...</div>
        <!-- <div *ngIf="passwordCtl.touched && passwordCtl.hasError('upperCaseCharacter')">Upper case character missing...</div>
        <div *ngIf="passwordCtl.touched && passwordCtl.hasError('lowerCaseCharacter')">Lower case character missing...</div>
        <div *ngIf="passwordCtl.touched && passwordCtl.hasError('specialCharacter')">Special character missing...</div> -->
      </app-auth-input-control>

      <!-- CONFIRM PASSWORD CTL -->
      <app-auth-input-control
        *ngIf="loginSignup() === 'signup'"
        class="ite-confirm-password-ctl ion-margin-top"
        [ngClass]="{'ite-password-missmatch': passwordMissmatch()}"
        type="password"
        label="Confirm password"
        [formControl]="confirmPasswordCtl"
      >
        <div *ngIf="confirmPasswordCtl.touched && confirmPasswordCtl.hasError('required')">Password confirmation required...</div>
        <div *ngIf="passwordMissmatch()">Password missmatch...</div>
      </app-auth-input-control>

      <!-- SUBMIT BUTTON -->
      <div class="ite-submit-button">
        <ion-button type="submit" class="ion-padding-top" expand="block">
          {{ this.loginSignup() === 'login' ? 'Login' : 'Signup' }}
        </ion-button>
      </div>

      <div class="text-xs pt-sm">
        <ion-text color="danger" class="block" *ngIf="form.touched && form.hasError('controlsMismatch-passwordCtl-confirmPasswordCtl')">Mismatch between password and confirmed password...</ion-text>
      </div>

      <!-- SIGNUP/LOGIN COMMENTS -->
      <div class="ite-signup-login-comments flex ion-justify-content-center ion-align-items-center">
        <span class="flex-none">No account yet?</span>
        <ion-button class="flex-none" fill="clear" [strong]="true" color="primary" (click)="onLoginSignupToggle()">
          {{ this.loginSignup() === 'login' ? 'Signup' : 'Login' }}
        </ion-button
        >
      </div>
    </form>
  `,
  styles: `
    .ite-auth-errors {
      background-color: var(--ion-color-danger);
      color: var(--ion-color-danger-contrast);
    }

    .ite-password-missmatch {
      --border-color: var(--ion-color-danger);
      --label-color: var(--ion-color-danger);
      --outline-color: var(--ion-color-danger);
    }
  `,
})

export class AuthLoginSignupComponent {

  // DEPENDENCIES
  userService = inject(UserService)

  // INPUTS

  // OUTPUTS

  // VARS
  emailCtl = new FormControl('', [
    Validators.required,
    Validators.email
  ])
  passwordCtl = new FormControl('', [
    Validators.required,
    Validators.minLength(6),
    patternValidator(/[0-9]+/, 'numericCharacter'),
    // patternValidator(/[a-z]+/, 'lowerCaseCharacter'),
    // patternValidator(/[A-Z]+/, 'upperCaseCharacter'),
    // patternValidator(/[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]+/, 'specialCharacter'),
  ])
  confirmPasswordCtl = new FormControl('', [
    Validators.required,
  ])
  
  form = new FormGroup({
    emailCtl: this.emailCtl,
    passwordCtl: this.passwordCtl,
    confirmPasswordCtl: this.confirmPasswordCtl,
  })

  // TEMPLATE VARS
  errorMessages = signal<string[]>([])
  loginSignup = signal<'login' | 'signup'>('login')
  passwordMissmatch = () => this.passwordCtl.touched && this.confirmPasswordCtl.touched && this.passwordCtl.value !== this.confirmPasswordCtl.value
  
  // TEMPLATE ACTIONS
  onLoginSignupToggle = () => this.loginSignup() === 'login' ? this.loginSignup.set('signup') : this.loginSignup.set('login')
  onSubmit = async () => {
    this.errorMessages.set([])

    switch(this.loginSignup()) {
      case 'login': {
        this.emailCtl.markAsTouched()
        this.passwordCtl.markAsTouched()

        if (this.emailCtl.valid && this.passwordCtl.valid) {
          this.userService.login(this.emailCtl.value!, this.passwordCtl.value!)
            .then(() => console.log('successful login'))
            .catch(err => {
              this.errorMessages.set([err.message])
            })
        }
        break;
      }

      case 'signup': {
        this.emailCtl.markAsTouched()
        this.passwordCtl.markAsTouched()
        this.confirmPasswordCtl.markAllAsTouched()

        if (this.emailCtl.valid && this.passwordCtl.valid && this.confirmPasswordCtl.valid) {
          this.userService.signup(this.emailCtl.value!, this.passwordCtl.value!)
            .then(() => console.log('successful signup'))
            .catch(err => {
              this.errorMessages.set([err.message])
            })
        }
        break;
      }
    }
  }

  // UTILS
}

const patternValidator = (regex: RegExp, errorKey: string) => (control: AbstractControl) => {
  if(control.value.trim() === '') return null
  const isValid = regex.test(control.value)
  return isValid ? null : { [errorKey]: true }
} 

