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
  selector: 'app-auth-login-signup',
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
      <div>
        <ion-input
          class="override ionic styles"
          type="email"
          label="Email"
          label-placement="stacked"
          fill="outline"
          mode="md"
          placeholder="Enter email"
          [formControl]="emailCtl"
        />
        <div class="text-xs pt-sm">
           <ion-text color="danger" class="block" *ngIf="emailCtl.touched && emailCtl.hasError('required')">Enter an email...</ion-text>
           <ion-text color="danger" class="block" *ngIf="emailCtl.touched && emailCtl.hasError('email')">Invalid email...</ion-text>
        </div>
      </div>

      <!-- PASSWORD CTL -->
      <div class="ion-margin-top">
        <ion-input
          class="override ionic styles"
          type="password"
          label="Password"
          label-placement="stacked"
          fill="outline"
          mode="md"
          placeholder="Enter password"
          [formControl]="passwordCtl"
        >
        </ion-input>
        <div class="text-xs pt-sm">
          <ion-text color="danger" class="block" *ngIf="passwordCtl.touched && passwordCtl.hasError('required')">Enter a password...</ion-text>
          <ion-text color="danger" class="block" *ngIf="passwordCtl.touched && passwordCtl.hasError('minLength')">Is not at least 6 characters long...</ion-text>
          <ion-text color="danger" class="block" *ngIf="passwordCtl.touched && passwordCtl.hasError('lowerCaseCharacter')">Lower case character missing...</ion-text>
          <ion-text color="danger" class="block" *ngIf="passwordCtl.touched && passwordCtl.hasError('upperCaseCharacter')">Upper case character missing...</ion-text>
          <ion-text color="danger" class="block" *ngIf="passwordCtl.touched && passwordCtl.hasError('specialCharacter')">Special character missing...</ion-text>
          <ion-text color="danger" class="block" *ngIf="passwordCtl.touched && passwordCtl.hasError('numericCharacter')">Numeric character missing...</ion-text>
        </div>
      </div>

      <!-- CONFIRM PASSWORD CTL -->
      <div class="ion-margin-top">
        <ion-input
          class="override ionic styles"
          type="password"
          label="Confirm password"
          label-placement="stacked"
          fill="outline"
          mode="md"
          placeholder="Confirm password"
          [formControl]="confirmPasswordCtl"
        >
        </ion-input>

        <div class="text-xs pt-sm">
          <ion-text color="danger" class="block" *ngIf="confirmPasswordCtl.touched && confirmPasswordCtl.hasError('required')">Enter a password...</ion-text>
          <ion-text color="danger" class="block" *ngIf="form.touched && form.touched && form.hasError('controlsMismatch-passwordCtl-confirmPasswordCtl')">Missmatch</ion-text>
        </div>
      </div>

      <!-- TEMP CTL -->
      <app-auth-input-control
        class="ion-margin-top"
        type="password"
        label="tempo"
        placeholder="tempo"
      >
        <div>Some error here</div>
      </app-auth-input-control>

      <app-auth-input-control-2
        class="ion-margin-top"
        type="text"
        label="Label"
        [formControl]="customCtl"
      ></app-auth-input-control-2>

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

export class AuthLoginSignupComponent {

  // DEPENDENCIES
  auth = inject(UserService)


  // OUTPUTS
  login = output()
  toggleLoginSignup = output()


  // VARS
  emailCtl = new FormControl('', {
    validators: [
      Validators.required,
      Validators.email
    ],
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
  })

  confirmPasswordCtl = new FormControl('', {
    validators: [
      Validators.required,
    ],
  })

  tempCtl = new FormControl('', {

  })

  customCtl = new FormControl('abc', {
    validators: [
      Validators.required,
      minLengthValidator(3)
    ]
  })
  
  form = new FormGroup({
    emailCtl: this.emailCtl,
    passwordCtl: this.passwordCtl,
    confirmPasswordCtl: this.confirmPasswordCtl,
    tempCtl: this.tempCtl,
    customCtl: this.customCtl
  }, {
    validators: [
      // controlsMismatchValidator('passwordCtl', 'confirmPasswordCtl'),
    ]
  })


  // INIT
  constructor() {
    setTimeout(() => {
      
    }, 5000);
  }


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

// const controlsMismatchValidator = (ctlName1: string, ctlName2: string) => (control: AbstractControl) => {
//   const ctl1 = control.get(ctlName1)!.value
//   const ctl2 = control.get(ctlName2)!.value
//   if (ctl2.trim() === '' || ctl1 === ctl2) return null
//   control.get(ctlName1)!.setErrors({someErrorHere: true})
//   return { [`controlsMismatch-${ctlName1}-${ctlName2}`]: true }
// }

const controlsMismatchValidator = (ctlName1: string, ctlName2: string) => (control: AbstractControl) => {
  const ctl1 = control.get(ctlName1)!
  const ctl2 = control.get(ctlName2)!
  if (ctl2.value.trim() === '' || ctl1.value === ctl2.value) {
    ctl1.setErrors(null)
    ctl2.setErrors(null)
    return null
  } else {
    const err = { [`controlsMismatch-${ctlName1}-${ctlName2}`]: true }
    ctl1.setErrors(err)
    ctl2.setErrors(err)
    return err
  }
}