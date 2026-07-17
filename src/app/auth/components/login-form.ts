import { Component, input, output, signal } from "@angular/core";
import { IonicModule } from '@ionic/angular';
import { email, form, FormField, minLength, required } from "@angular/forms/signals";
import { AppList } from "../../_shared/app-list";
import { AuthError } from "../../_types/AuthErrors";

import { addIcons } from 'ionicons';
import { alertCircleOutline } from 'ionicons/icons';


@Component({
  selector: 'app-login-form',
  imports: [
    IonicModule,
    AppList,
    FormField
],
  template: `
    @if(backendAuthErrors().length > 0) {
      <app-list>
        <ion-item style="--background: var(--ion-color-danger);">
          <ion-icon name="alert-circle-outline" slot="start"></ion-icon>
          <ion-label class="pl-4">
            <ul class="text-sm">
              @for(error of backendAuthErrors(); track error.code) {
                <li>{{error.message}}</li>
              }
            </ul>
          </ion-label>
        </ion-item>
      </app-list>
    }

    <app-list [class]="{invalid: form.email().invalid() && form.email().touched()}">
      <ion-header>Email</ion-header>
      <ion-item>
        <ion-input 
          type="text"
          placeholder="Enter an email"
          [formField]="form.email"
          [clearInput]="true"
          (ionInput)="onEmailInput()"
        />
      </ion-item>
      @if(form.email().invalid() && form.email().touched()) {
        <ion-footer style="color: var(--ion-color-danger);">
          @for(error of form.email().errors(); track error.kind) {
            <div>{{ error.message }}</div>
          }
        </ion-footer>
      }
    </app-list>

    <app-list [class]="{invalid: form.password().invalid() && form.password().touched()}">
      <ion-header>Password</ion-header>
      <ion-item>
        <ion-input 
          type="password" 
          placeholder="Enter a password"
          [formField]="form.password"
          (ionInput)="onPasswordInput()"
        >
          <ion-input-password-toggle slot="end"/>
        </ion-input>
      </ion-item>
      @if(form.password().invalid() && form.password().touched()) {
        <ion-footer style="color: var(--ion-color-danger);">
          @for(error of form.password().errors(); track error.kind) {
            <div>{{ error.message }}</div>
          }
        </ion-footer>
      }
    </app-list>

    <ion-button 
      class="pt-8"
      expand="block"
      (click)="onLoginButtonClick()"
    >
      Login
    </ion-button>

    <div class="flex items-center justify-center">
      <span>No account yet?</span> 
      <ion-button 
        color="primary" 
        fill="clear"
        (click)="onSignupButtonClick()"
      >
        signup
      </ion-button>
    </div>
  `,
  styles: [`
    app-list.invalid {
      --items-outline-color: var(--ion-color-danger);
    }  
  `]
})
export class LoginForm {
  backendAuthErrors = input<AuthError[]>([], {alias: 'authErrors'})
  input = output<void>()
  login = output<{email: string, password: string}>()
  toggleToSignup = output<void>()

  private formModel = signal<{email: string, password: string}>({
    email: '',
    password: ''
  })

  protected form = form(this.formModel, (schema) => {
    email(schema.email, {message: 'Must be a valid email'})
    required(schema.email, {message: 'An email is required'})
    minLength(schema.password, 6, {message: 'A password must be at least 6 character long'})
    required(schema.password, {message: 'A password is required'})
  })

  constructor() {
    addIcons({alertCircleOutline})
  }

  protected onLoginButtonClick = () => {
    if(this.form().valid()) {
      const email = this.form.email().value()
      const password = this.form.password().value()
      this.login.emit({email, password})
    }
    else {
      this.form.email().markAsTouched()
      this.form.password().markAsTouched()
    }
  }

  protected onEmailInput = () => {
    this.input.emit()
  }

  protected onPasswordInput = () => {
    this.input.emit()
  }

  protected onSignupButtonClick = () => {
    this.toggleToSignup.emit()
  }
}







// @Component({
//   selector: 'app-login-form',
//   imports: [
//     IonicModule,
//     AppList
// ],
//   template: `
//     <app-list 
//       [class.focused]="isEmailCtlFocused()"
//       [class.invalid]="form.email().invalid() && form.email().touched()"
//     >
//       <app-list-header>Email</app-list-header>
//       <app-list-items>
//         <ion-item>
//           <ion-input
//             type="text"
//             placeholder="Enter an email"
//             [formField]="form.email"
//             (ionFocus)="onEmailCtlFocus()"
//             (ionBlur)="onEmailCtlBlur()"
//           />
//         </ion-item>
//       </app-list-items>
//       <app-list-helper>
//         @if(form.email().invalid() && form.email().touched()) {
//           <ul>
//             @for(error of form.email().errors(); track error.kind) {
//               <li>{{ error.message }}</li>
//             }
//           </ul>
//         }
//       </app-list-helper>
//     </app-list>

//     <app-list>
//       <app-list-header>Password</app-list-header>
//       <app-list-items>
//         <ion-item>
//           <ion-input type="password" placeholder="Enter a password">
//             <ion-input-password-toggle slot="end"/>
//           </ion-input>
//         </ion-item>
//       </app-list-items>
//       <app-list-helper></app-list-helper>
//     </app-list>

//     <ion-button 
//       expand="block" 
//       style="margin-top: 48px;" 
//     >
//       Login
//     </ion-button>


//     <div class="flex items-center">
//       <span>No account yet?</span> 
//       <ion-button 
//         color="primary" 
//         fill="clear" 
//         (click)="toggleToSignup.emit()"
//       >
//         signup
//       </ion-button>
//     </div> 
//   `,
//   styles: [`
//     app-list {
//       --items-outline-width: 1px;
//       --items-outline-color: var(--ion-color-medium);
//       --footer-color: var(--ion-color-danger);
//     }

//     app-list.focused {
//       --items-outline-width: 2px;
//       --items-outline-color: var(--ion-color-dark);
//     }

//     app-list.invalid {
//       --items-outline-color: var(--ion-color-danger);
//     }

//     app-list.focused.invalid {
//       --items-outline-width: 2px;
//       --items-outline-color: var(--ion-color-danger);
//     }
//   `]
// })
// export class LoginForm {
//   login = output<{email: string, password: string}>()
//   toggleToSignup = output<void>()

//   model = signal<{email: string, password: string}>({
//     email: 'a',
//     password: ''
//   })

//   form = form(this.model, (schema) => {
//     email(schema.email, {message: 'Must be a valid email'})
//   })

//   isEmailCtlFocused = signal(false)

//   onEmailCtlFocus() {
//     this.isEmailCtlFocused.set(true)
//   }

//   onEmailCtlBlur() {
//     this.isEmailCtlFocused.set(false)
//   }

//   hasError(ctl: FieldState<string, string>, kind?: string) {
//     if(kind !== undefined && ctl.errors().find(err => err.kind === kind)) {
//       return true
//     }
//     if(kind === undefined && ctl.errors().length > 0) {
//       return true
//     }
//     return false
//   }
// }