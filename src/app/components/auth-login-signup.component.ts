import { CommonModule } from '@angular/common';
import { Component, inject, signal, viewChild } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonButton, IonText } from '@ionic/angular/standalone';
import { Subject, takeUntil } from 'rxjs';

import { AuthService } from '../services/auth.service';
import { AuthInputControlComponent } from './auth-input-control.component';


@Component({
  selector: 'app-auth-login-signup',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    IonButton,
    AuthInputControlComponent
  ],
  template: `

    <!-- AUTH ERRORS -->
    <div 
      class="ite-auth-errors p-sm mb-lg"
      *ngIf="errorMessages().length > 0"
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
        <ion-button type="submit" class="ion-padding-top" expand="block" [disabled]="this.authService.isLoading$ | async">
          {{ this.loginSignup() === 'login' ? 'Login' : 'Signup' }}
        </ion-button>
      </div>

      <!-- SIGNUP/LOGIN COMMENTS -->
      <div class="ite-signup-login-comments flex ion-justify-content-center ion-align-items-center">
        <span class="flex-none">No account yet?</span>
        <ion-button class="flex-none" fill="clear" [strong]="true" color="primary" [disabled]="this.authService.isLoading$ | async" (click)="onLoginSignupToggle()">
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
  authService = inject(AuthService)

  // VARS
  destroy$ = new Subject<void>()

  // TEMPLATE VARS
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

  errorMessages = signal<string[]>([])
  loginSignup = signal<'login' | 'signup'>('login')
  passwordMissmatch = () => this.passwordCtl.touched && this.confirmPasswordCtl.touched && this.passwordCtl.value !== this.confirmPasswordCtl.value
  
  // TEMPLATE ACTIONS
  onLoginSignupToggle = () => this.loginSignup() === 'login' ? this.loginSignup.set('signup') : this.loginSignup.set('login')

  onSubmit = () => {
    this.errorMessages.set([])

    switch(this.loginSignup()) {
      case 'login': {
        this.onSubmitLogin()
        break;
      }

      case 'signup': {
        this.onSubmitSignup()
        break;
      }
    }
  }

  constructor() {
    this.authService.isLoading$.pipe(takeUntil(this.destroy$)).subscribe(isLoading => this.onUserIsLoading(isLoading))
  }

  ngOnDestroy() {
    this.destroy$.next()
  }

  // UTILS  
  private onUserIsLoading = (isLoading: boolean) => {
    if(isLoading) {
      this.emailCtl.disable()
      this.passwordCtl.disable()
      this.confirmPasswordCtl.disable()
    } else {
      this.emailCtl.enable()
      this.passwordCtl.enable()
      this.confirmPasswordCtl.enable()
    }
  }

  private onSubmitLogin = () => {
    this.emailCtl.markAsTouched()
    this.passwordCtl.markAsTouched()

    if (this.emailCtl.valid && this.passwordCtl.valid) {
      this.authService.login(this.emailCtl.value!, this.passwordCtl.value!)
        .then(_ => {
          this.form.reset()
        })
        .catch(err => {
          this.errorMessages.set([err.message])
        })
    }
  }

  private onSubmitSignup = () => {
    this.emailCtl.markAsTouched()
    this.passwordCtl.markAsTouched()
    this.confirmPasswordCtl.markAsTouched()

    if (this.emailCtl.valid && this.passwordCtl.valid && this.confirmPasswordCtl.valid) {
      this.authService.signup(this.emailCtl.value!, this.passwordCtl.value!)
        .then(_ => {
          this.form.reset()
        })
        .catch(err => {
          this.errorMessages.set([err.message])
        })
    }
  }
}


// TODO: export to external utility file???
const patternValidator = (regex: RegExp, errorKey: string) => (control: AbstractControl) => {
  if(control.value && control.value.trim() === '') return null
  const isValid = regex.test(control.value)
  return isValid ? null : { [errorKey]: true }
} 

