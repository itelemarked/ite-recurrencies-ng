import { CommonModule } from '@angular/common';
import { Component, computed, inject, input, InputSignal, model, output, signal, WritableSignal } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import {
  IonButton,
  IonText,
} from '@ionic/angular/standalone';
import { UserService } from '../services/user.service';
import { AuthInputControl2Component } from './auth-input-control-2.component';


@Component({
  selector: 'app-auth-login-signup-3',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    AuthInputControl2Component,
    IonButton,
    IonText,
  ],
  template: `
    <form class="form" [formGroup]="form" (ngSubmit)="onSubmit($event)">

      <!-- EMAIL CTL -->
      <app-auth-input-control-2
        type="text"
        label="Email"
        [formControl]="emailCtl"
      >
        <div *ngIf="emailCtl.touched && emailCtl.hasError('email')">Invalid email...</div>
        <div *ngIf="emailCtl.touched && emailCtl.hasError('required')">Email required...</div>
      </app-auth-input-control-2>

      <!-- PASSWORD CTL -->
      <app-auth-input-control-2
        class="ite-password ion-margin-top"
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
      </app-auth-input-control-2>

      <!-- CONFIRM PASSWORD CTL -->
      <app-auth-input-control-2
        *ngIf="loginSignup() === 'signup'"
        class="ite-confirm-password ion-margin-top"
        [ngClass]="{'ite-password-missmatch': passwordMissmatch()}"
        type="password"
        label="Confirm password"
        [formControl]="confirmPasswordCtl"
      >
        <div *ngIf="confirmPasswordCtl.touched && confirmPasswordCtl.hasError('required')">Password confirmation required...</div>
        <div *ngIf="passwordMissmatch()">Password missmatch...</div>
      </app-auth-input-control-2>

      <!-- SUBMIT BUTTON -->
      <div>
        <ion-button type="submit" class="ion-padding-top" expand="block">
          {{ this.loginSignup() === 'login' ? 'Login' : 'Signup' }}
        </ion-button>
      </div>

      <div class="text-xs pt-sm">
        <ion-text color="danger" class="block" *ngIf="form.touched && form.hasError('controlsMismatch-passwordCtl-confirmPasswordCtl')">Mismatch between password and confirmed password...</ion-text>
      </div>

      <!-- SIGNUP/LOGIN COMMENTS -->
      <div class="flex ion-justify-content-center ion-align-items-center">
        <span class="flex-none">No account yet?</span>
        <ion-button class="flex-none" fill="clear" [strong]="true" color="primary" (click)="onLoginSignupToggle()">
          {{ this.loginSignup() === 'login' ? 'Signup' : 'Login' }}
        </ion-button
        >
      </div>
    </form>
  `,
  styles: `
    .ite-password-missmatch {
      --border-color: var(--ion-color-danger);
      --label-color: var(--ion-color-danger);
      --outline-color: var(--ion-color-danger);
    }
  `,
})

export class AuthLoginSignup3Component {

  // DEPENDENCIES
  auth = inject(UserService)

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
  loginSignup = signal('login')
  passwordMissmatch = () => this.passwordCtl.touched && this.confirmPasswordCtl.touched && this.passwordCtl.value !== this.confirmPasswordCtl.value
  
  // TEMPLATE ACTIONS
  onLoginSignupToggle = () => this.loginSignup() === 'login' ? this.loginSignup.set('signup') : this.loginSignup.set('login')
  onSubmit(e: SubmitEvent) {}

  // UTILS
}

const patternValidator = (regex: RegExp, errorKey: string) => (control: AbstractControl) => {
  const isValid = regex.test(control.value)
  return isValid ? null : { [errorKey]: true }
} 

