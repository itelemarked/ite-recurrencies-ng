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
import { UserService } from '../services/user.service';
import { AuthInputControlComponent } from './auth-input-control.component';
import { AuthInputControl2Component } from './auth-input-control-2.component';


@Component({
  selector: 'app-auth-login-signup-2',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    AuthInputControlComponent,
    AuthInputControl2Component,
    IonButton,
    IonInput,
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
        <div *ngIf="touchedCtlHasError(emailCtl, 'email')">Invalid email...</div>
        <div *ngIf="touchedCtlHasError(emailCtl, 'required')">Email required...</div>
      </app-auth-input-control-2>

      <!-- PASSWORD CTL -->
      <app-auth-input-control-2
        class="ion-margin-top"
        type="password"
        label="Password"
        [formControl]="passwordCtl"
      >
        <div *ngIf="touchedCtlHasError(passwordCtl, 'required')">Password required...</div>
        <div *ngIf="touchedCtlHasError(passwordCtl, 'minLength')">Is not at least 6 characters long...</div>
        <div *ngIf="touchedCtlHasError(passwordCtl, 'lowerCaseCharacter')">Lower case character missing...</div>
        <div *ngIf="touchedCtlHasError(passwordCtl, 'upperCaseCharacter')">Upper case character missing...</div>
        <div *ngIf="touchedCtlHasError(passwordCtl, 'specialCharacter')">Special character missing...</div>
        <div *ngIf="touchedCtlHasError(passwordCtl, 'numericCharacter')">Numeric character missing...</div>
      </app-auth-input-control-2>

      <!-- CONFIRM PASSWORD CTL -->
      <app-auth-input-control-2
        class="ion-margin-top"
        type="password"
        label="Confirm password"
        [formControl]="confirmPasswordCtl"
      >
        <div *ngIf="touchedCtlHasError(confirmPasswordCtl, 'required')">Password confirmation required...</div>
      </app-auth-input-control-2>

      <!-- SUBMIT BUTTON -->
      <div>
        <ion-button type="submit" class="ion-padding-top" expand="block">
          Login
        </ion-button>
      </div>

      <div class="text-xs pt-sm">
        <ion-text color="danger" class="block" *ngIf="form.touched && form.hasError('controlsMismatch-passwordCtl-confirmPasswordCtl')">Mismatch between password and confirmed password...</ion-text>
      </div>

      <!-- SIGNUP/LOGIN COMMENTS -->
      <div class="flex ion-justify-content-center ion-align-items-center">
        <span class="flex-none">No account yet?</span>
        <ion-button class="flex-none" fill="clear" [strong]="true" color="primary" (click)="toggleLoginSignup.emit()">
          Signup
        </ion-button
        >
      </div>
    </form>
  `,
  styles: `
    

    /* Override ionic default highlight color */
    // ion-input.override.ionic.styles {
    //   --highlight-color: var(--ion-color-dark);
    //   --border-color: var(--ion-color-dark);
    //   --color: var(--ion-color-dark);
    // }

    .ng-submitted ion-input.ng-invalid {
      --border-color: var(--ion-color-danger);
    }

    ion-button {
      --border-radius: 5px;
    }
  `,
})

export class AuthLoginSignup2Component {

  // DEPENDENCIES
  auth = inject(UserService)


  // OUTPUTS
  login = output()
  toggleLoginSignup = output()


  // VARS
  // emailCtl = new FormControl('', {
  //   validators: [
  //     Validators.required,
  //     Validators.email
  //   ],
  // })

  // passwordCtl = new FormControl('', {
  //   validators: [
  //     Validators.required,
  //     minLengthValidator(6),
  //     hasRegex(/[0-9]+/, 'numericCharacter'),
  //     hasRegex(/[a-z]+/, 'lowerCaseCharacter'),
  //     hasRegex(/[A-Z]+/, 'upperCaseCharacter'),
  //     hasRegex(/[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]+/, 'specialCharacter'),
  //   ],
  // })

  emailCtl = new FormControl('')
  passwordCtl = new FormControl('')
  confirmPasswordCtl = new FormControl('')
  
  form = new FormGroup({
    emailCtl: this.emailCtl,
    passwordCtl: this.passwordCtl,
    confirmPasswordCtl: this.confirmPasswordCtl,
  })

  // TEMPLATE VARS
  touchedCtlHasError = (ctl: AbstractControl, errorKey: string) => ctl.touched && ctl.hasError(errorKey)


  // INIT
  constructor() {
    this.emailCtl.addValidators([
      Validators.required,
      Validators.email
    ])

    this.passwordCtl.addValidators([
      Validators.required,
      minLengthValidator(6),
      hasRegex(/[0-9]+/, 'numericCharacter'),
      hasRegex(/[a-z]+/, 'lowerCaseCharacter'),
      hasRegex(/[A-Z]+/, 'upperCaseCharacter'),
      hasRegex(/[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]+/, 'specialCharacter'),
      // doesn
      // missmatchWithValidator(this.confirmPasswordCtl)
    ])

    this.confirmPasswordCtl.addValidators([
      Validators.required,
      // missmatchWithValidator(this.passwordCtl)
    ])

    this.form.addValidators([
      controlsMissmatchValidator('passwordCtl', 'confirmPasswordCtl')
    ])
  }

  ngAfterViewInit() {
    // const newErr = {'aaa-aaa': true}
    // console.log(this.emailCtl.errors)
    // this.addError(this.emailCtl, newErr)
    // console.log(this.emailCtl.errors)
    // this.removeError(this.emailCtl, newErr)
    // console.log(this.emailCtl.errors)
    // this.removeError(this.emailCtl, {required: true})
    // console.log(this.emailCtl.errors)
  }


  // UTILS

  // ACTIONS
  onSubmit(e: SubmitEvent) {}
}


const minLengthValidator = (min: number): ValidatorFn => (control: AbstractControl) => {
  if (control.value.length >= min) return null
  return { minLength: 'minLenght' }
}

const hasRegex = (regex: RegExp, errorKey: string) => (control: AbstractControl) => {
  const isValid = regex.test(control.value)
  return isValid ? null : { [errorKey]: true }
} 

const missmatchWithValidator = (missMatchCtl: AbstractControl) => (control: AbstractControl) => {
  const hasMissmatch = missMatchCtl.value !== control.value && missMatchCtl.touched
  return hasMissmatch ? { 'missmatch-with': true } : null
}

const controlsMissmatchValidator = (ctlName1: string, ctlName2: string) => (control: AbstractControl) => {
  console.log('controlsMissmatchValidator')
  const ctl1 = control.get(ctlName1)!
  const ctl2 = control.get(ctlName2)!
  const newErr = { [`missmatch-${ctlName1}-${ctlName2}`]: true }
  console.log(ctl1.value !== ctl2.value)
  console.log(ctl1.touched)
  console.log(ctl2.touched)
  if (
    ctl1.value !== ctl2.value
    // && ctl1.touched
    // && ctl2.touched
  ) {
    // console.log('A')
    addError(ctl1, newErr)
    // console.log(ctl1.errors)
    addError(ctl2, newErr)
    // console.log(ctl2.errors)
    return newErr
  } else {
    // console.log('B')
    removeError(ctl1, newErr)
    removeError(ctl2, newErr)
    return null
  }
}

function addError(ctl: AbstractControl, err: Record<string, any>) {
  const keys = Object.keys(err)
  if(keys.length > 1) throw new Error(`err object must have exatly one key-value pair!`)

  const newError = { ...ctl.errors, ...err }
  ctl.setErrors(newError)
}

function removeError(ctl: AbstractControl, err: Record<string, any>) {
  const keys = Object.keys(err)
  if(keys.length > 1) throw new Error(`err object must have exactly one key-value pair!`)

  if(ctl.errors === null || !Object.keys(ctl.errors).includes(keys[0])) return
  
  const { [`${keys[0]}`]: key, ...newErr} = ctl.errors as Record<string, any>
  Object.keys(newErr).length === 0 ? ctl.setErrors(null) : ctl.setErrors(newErr)
}

