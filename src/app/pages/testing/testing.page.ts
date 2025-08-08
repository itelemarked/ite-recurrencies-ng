import { Component, computed, inject, Signal, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormControl, FormGroup, FormsModule, NgModel, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';

import {
  IonButton,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import {
  BehaviorSubject,
  catchError,
  combineLatest,
  delay,
  interval,
  map,
  Observable,
  of,
  startWith,
  switchMap,
  take,
  tap,
} from 'rxjs';

import { delay as delayFn } from '@app/utils/testing';
import { Settings5Service } from '@app/services/settings5.service';
import { Auth5Service } from '@app/services/auth5.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AppInputComponent } from './app-input.component';
import { toSignal } from '@angular/core/rxjs-interop';


type ControlErrorId = string
type ControlErrorValue = string
type ControlError = Record<ControlErrorId, ControlErrorValue>


@Component({
  selector: 'app-testing',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButton,
    IonInput,
    IonLabel,
    AppInputComponent,
    IonItem
  ],
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>Testing</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content [forceOverscroll]="false" class="ion-padding">

      <form [formGroup]="form">

        <!-- <p>Email value: {{ emailValue() }}</p> -->

        <app-input
          class="mt-lg"
          type="text"
          label="Email"
          formControlName="emailCtl"
          [errorMessages]="emailErrorMessagesWhenTouched"
          (input)="onUpdateEmailErrorMessagesWhenTouched()"
          (blur)="onUpdateEmailErrorMessagesWhenTouched()"
        />
        
        <app-input
          class="mt-lg"
          type="password"
          label="Password"
          formControlName="passwordCtl"
        />

        <app-input
          class="mt-lg"
          type="password"
          label="Confirm Password"
          formControlName="confirmPasswordCtl"
        />

      </form>

    </ion-content>
  `,
  styles: `
    app-input.ng-touched.ng-invalid {
      --border-color: var(--ion-color-danger);
      --outline-color: var(--ion-color-danger);
      --label-color: var(--ion-color-danger);
    }
  `,
})
export class TestingPage {

  // emailCtl = new FormControl('', this._emailControlValidator)
  emailCtl = new FormControl('', (ctl: AbstractControl<string>) => this._emailControlValidator(ctl.value))
  passwordCtl = new FormControl('', this._passwordControlValidator)
  confirmPasswordCtl = new FormControl('', (ctl: AbstractControl<string>) => this.anyValidator())

  form = new FormGroup({
    emailCtl: this.emailCtl,
    passwordCtl: this.passwordCtl,
    confirmPasswordCtl: this.confirmPasswordCtl 
  })

  anyValidator(): ValidationErrors | null {
    console.log(this.confirmPasswordCtl.value)
    return {'any-validator': true}
  }


  // TEMPLATE VARIABLES

  emailErrorMessagesWhenTouched: string[] = []
  passwordErrorMessagesWhenTouched: string[] = []
  confirmPasswordErrorMessagesWhenTouched: string[] = []
  
  onUpdateEmailErrorMessagesWhenTouched = () => {
    // this.emailErrorMessagesWhenTouched = this._getValidatorErrorMessages(this.emailCtl, this._emailControlValidator)
  }

  // onUpdateEmailErrorMessagesWhenTouched = () => {
  //   if(this.emailCtl.touched) {
  //     const errors = this._emailControlValidator(this.emailCtl)
  //     if(errors === null) {
  //       this.emailErrorMessagesWhenTouched = []
  //     } else {
  //       this.emailErrorMessagesWhenTouched = Object.values(errors)
  //     }
  //   }
  // }

  constructor() {
    this.confirmPasswordCtl.valueChanges.subscribe(val => console.log(this.confirmPasswordCtl.errors))
  }
  
  // onEmailControlBlur = () => {
  //   const errors = this._emailControlValidator(this.emailCtl)
  //   if(errors === null) {
  //     this.emailErrorMessagesWhenTouched = []
  //   } else {
  //     this.emailErrorMessagesWhenTouched = Object.values(errors)
  //   }
  // }

  // UTILS METHODS

  private _getValidatorErrorMessages(formControl: FormControl, validatorFn: ValidatorFn) {
    const errors = validatorFn(formControl)
    if(errors === null) return []
    return Object.values(errors)
  }

  // private _emailControlValidator(control: AbstractControl<string | null>): ControlError | null {
  //   if(control.value === null) return {'null': '"Null" value not allowed...'}

  //   const isEmptyString = /^$/.test(control.value)
  //   const hasWhiteSpaces = /\s/.test(control.value)
  //   const isEmail = /^(?:[a-zA-Z0-9_-]+)(?:\.[a-zA-Z0-9_-]+)?@(?:[a-zA-Z0-9_-]+)\.(?:[a-zA-Z0-9_-]+)$/.test(control.value)
    
  //   if(isEmptyString) return {'empty-string': 'Enter an email value'}
  //   if(hasWhiteSpaces) return {'white-spaces': 'White spaces not allowed'}
  //   if(!isEmail) return {'not-email': 'Enter a valid email format'}
  //   return null
  // }

  private _emailControlValidator(emailInputValue: string): ControlError | null {
    const isEmptyString = /^$/.test(emailInputValue)
    const hasWhiteSpaces = /\s/.test(emailInputValue)
    const isEmail = /^(?:[a-zA-Z0-9_-]+)(?:\.[a-zA-Z0-9_-]+)?@(?:[a-zA-Z0-9_-]+)\.(?:[a-zA-Z0-9_-]+)$/.test(emailInputValue)
    
    if(isEmptyString) return {'empty-string': 'Enter an email value'}
    if(hasWhiteSpaces) return {'white-spaces': 'White spaces not allowed'}
    if(!isEmail) return {'not-email': 'Enter a valid email format'}
    return null
  }

  private _passwordControlValidator(ctl: AbstractControl): Record<string, string> | null {
    // console.log('passwordValidator')
    const isEmptyString = /^$/.test(ctl.value)
    const isMinLength = (min: number) => ctl.value.length >= min
    const hasNumber = /\d/.test(ctl.value)
    const hasCapital = /[A-Z]/.test(ctl.value)
    const hasSpecialCharacter = /[@!]/.test(ctl.value)

    const errors: Record<string, string> = {}
    if(isEmptyString) {
      errors['empty-string'] = 'Enter a password value'
      return errors
    }

    if(!isMinLength(6)) errors['min-length'] = 'Must be at least 6 characters long'
    if(!hasNumber) errors['no-numeric-character'] = 'Must have at least one numeric character'
    if(!hasCapital) errors['no-capital-character'] = 'Must have at least one capital character'
    if(!hasSpecialCharacter) errors['no-special-character'] = 'Must have at least one special character'
    if(Object.keys(errors).length !== 0) return errors

    return null
  }
}



