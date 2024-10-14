import { CommonModule } from '@angular/common';
import { Component, computed, inject, output, signal } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
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
    <form class="ite-form" [formGroup]="form" (ngSubmit)="onSubmit($event)">
      <div>
        <ion-input
          class="ite-input"
          type="email"
          label="Email"
          label-placement="stacked"
          fill="outline"
          mode="md"
          placeholder="Enter email"
          [errorText]="emailErrorText"
          formControlName="emailCtl"
        ></ion-input>
      </div>

      <div class="ion-padding-top">
        <div style="position: relative;">
          <ion-input
            class="ite-input"
            [type]="passwordCtlType()"
            label="Password"
            label-placement="stacked"
            fill="outline"
            mode="md"
            placeholder="Enter password"
            [errorText]="passwordErrorText"
            formControlName="passwordCtl"
          >
          </ion-input>
          <div style="position: absolute; top: 0; right: 0; height: 100%; z-index: 3; display: flex; align-items: center;">
            <ion-button fill="clear" color="medium" (click)="onToggleShowPassword()">
              <ion-icon slot="icon-only" name="eye"></ion-icon>
            </ion-button>
          </div>
        </div>
      </div>

      <div>
        <ion-button
          type="submit"
          class="ion-padding-top"
          expand="block"
        >Login</ion-button>
      </div>

      <div class="flex ion-justify-content-center ion-align-items-center">
        <span>No account yet?</span>
        <ion-button
          fill="clear"
          [strong]="true"
          color="primary"
          (click)="toggleLoginSignup.emit()"
          >Signup</ion-button
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

    .flex {
      display: flex;
    }


    .ite-form.ng-submitted .ite-input.ng-invalid {
      --border-color: var(--highlight-color-invalid);
    }

  `,
})
export class AuthLoginComponent {

  // DEPENDENCIES

  auth = inject(AuthService)
  formBuilder = inject(FormBuilder)


  // OUTPUTS

  toggleLoginSignup = output()
  login = output()


  // VARS

  form = this.formBuilder.group({
    emailCtl: ['', [Validators.required, Validators.email]],
    passwordCtl: ['', [Validators.required, Validators.minLength(6)]]
  })

  emailErrorText = this.getEmailErrorText()

  passwordErrorText = this.getPasswordErrorText()

  showPassword = signal(false)

  passwordCtlType = computed(() => this.showPassword() ? 'text' : 'password')


  // INIT

  constructor() {
    addIcons({ eye })
    // this.form.valueChanges.subscribe((val) => {
    //   console.log(`a value has changed`)
    //   console.log(val)
    // })
  }


  // UTILS

  getEmailErrorText() {
    const ctl = this.form.get('emailCtl')!
    if (ctl.hasError('required')) return 'Enter an email...'
    if (ctl.hasError('email')) return 'Enter a valid email...'
    return ''
  }

  getPasswordErrorText() {
    const ctl = this.form.get('passwordCtl')!
    if (ctl.hasError('required')) return 'Enter an password...'
    if (ctl.hasError('minlength')) return 'Must be at least 6 characters long...'
    return ''
  }


  // ACTIONS

  onEmailChange() {
    this.emailErrorText = this.getEmailErrorText()
  }

  onPasswordChange() {
    this.passwordErrorText = this.getPasswordErrorText()
  }

  onToggleShowPassword() {
    const show = this.showPassword()
    this.showPassword.set(!show)
  }

  onSubmit(e: SubmitEvent) {
    e.preventDefault()
    this.form.markAllAsTouched()

    if (this.form.invalid) return
    this.login.emit()
  }

}
