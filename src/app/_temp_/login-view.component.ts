import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { AbstractControl, FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonButton } from '@ionic/angular/standalone';

import { AuthInputControlComponent } from '../components/auth-input-control.component';


@Component({
  selector: 'app-login-view',
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
      class="p-sm mb-lg"
      *ngIf="errorMessagesInput().length > 0"
    >
      <div *ngFor="let err of errorMessagesInput()">{{ err }}</div>
    </div>

    <!-- EMAIL CTL -->
    <app-auth-input-control
      type="text"
      label="Email"
      [formControl]="emailCtl"
    >
      <div *ngIf="emailCtl.touched && emailCtl.hasError('email')">Invalid email...</div>
      <div *ngIf="emailCtl.touched && emailCtl.hasError('required')">Email required...</div>
    </app-auth-input-control>

    <!-- PASSWORD CTL -->
    <app-auth-input-control
      class="ion-margin-top"
      type="password"
      label="Password"
      [formControl]="passwordCtl"
    >
      <div *ngIf="passwordCtl.touched && passwordCtl.hasError('required')">Password required...</div>
      <div *ngIf="passwordCtl.touched && passwordCtl.hasError('minlength')">Must be at least 6 characters long...</div>
      <div *ngIf="passwordCtl.touched && passwordCtl.hasError('numericCharacter')">Numeric character missing...</div>
    </app-auth-input-control>

    <!-- SUBMIT BUTTON -->
    <div>
      <ion-button type="submit" class="ion-padding-top" expand="block" (click)="onLoginClick()">
        Login
      </ion-button>
    </div>

    <!-- SIGNUP/LOGIN COMMENTS -->
    <div class="flex ion-justify-content-center ion-align-items-center">
      <span class="flex-none">No account yet?</span>
      <ion-button class="flex-none" fill="clear" [strong]="true" color="primary" (click)="onLoginSignupToggle()">
        Signup
      </ion-button
      >
    </div>
  `,
  styles: `
    .ite-auth-errors {
      background-color: var(--ion-color-danger);
      color: var(--ion-color-danger-contrast);
    }
  `,
})

export class LoginViewComponent {

  // INPUTS
  errorMessagesInput = input<string[]>([], {alias: 'errorMessages'})

  // OUPUTS
  loginOutput = output<{email: string, password: string}>({alias: 'login'})
  toggleLoginSignupOutput = output<void>({alias: 'toggleLoginSignup'})

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

  // TEMPLATE ACTIONS
  onLoginSignupToggle = () => this.toggleLoginSignupOutput.emit()
  onLoginClick = () => {
    if(this.emailCtl.valid && this.passwordCtl.valid) {
      const email = this.emailCtl!.value!
      const password = this.passwordCtl!.value!
      this.loginOutput.emit({email, password})
    }
  }

  // METHODS
  reset = () => {
    this.emailCtl.setValue('')
    this.passwordCtl.setValue('')
  }
  
}


// TODO: export to external utility file???
const patternValidator = (regex: RegExp, errorKey: string) => (control: AbstractControl) => {
  if(control.value && control.value.trim() === '') return null
  const isValid = regex.test(control.value)
  return isValid ? null : { [errorKey]: true }
} 

