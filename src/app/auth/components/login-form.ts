import { Component, output, signal } from "@angular/core";
import { IonicModule } from '@ionic/angular';
import { email, FieldState, form } from "@angular/forms/signals";
import { AppList } from "../../_shared/app-list";

@Component({
  selector: 'app-login-form',
  imports: [
    IonicModule,
    AppList
],
  template: `
    <app-list>
      <ion-header>Email</ion-header>
      <ion-item>
        <ion-input 
          type="text"
          placeholder="Enter an email"
        />
      </ion-item>
    </app-list>

    <app-list>
      <ion-header>Password</ion-header>
      <ion-item>
        <ion-input type="password" placeholder="Enter a password">
          <ion-input-password-toggle slot="end"/>
        </ion-input>
      </ion-item>
    </app-list>

    <ion-button 
      expand="block" 
      style="margin-top: 48px;"
    >
      Login
    </ion-button>

    <div class="flex items-center">
      <span>No account yet?</span> 
      <ion-button 
        color="primary" 
        fill="clear" 
        (click)="toggleToSignup.emit()"
      >
        signup
      </ion-button>
    </div>

    <!-- <app-list 
      [class.focused]="isEmailCtlFocused()"
      [class.invalid]="form.email().invalid() && form.email().touched()"
    >
      <app-list-header>Email</app-list-header>
      <app-list-items>
        <ion-item>
          <ion-input
            type="text"
            placeholder="Enter an email"
            [formField]="form.email"
            (ionFocus)="onEmailCtlFocus()"
            (ionBlur)="onEmailCtlBlur()"
          />
        </ion-item>
      </app-list-items>
      <app-list-helper>
        @if(form.email().invalid() && form.email().touched()) {
          <ul>
            @for(error of form.email().errors(); track error.kind) {
              <li>{{ error.message }}</li>
            }
          </ul>
        }
      </app-list-helper>
    </app-list>

    <app-list>
      <app-list-header>Password</app-list-header>
      <app-list-items>
        <ion-item>
          <ion-input type="password" placeholder="Enter a password">
            <ion-input-password-toggle slot="end"/>
          </ion-input>
        </ion-item>
      </app-list-items>
      <app-list-helper></app-list-helper>
    </app-list>

    <ion-button 
      expand="block" 
      style="margin-top: 48px;" 
    >
      Login
    </ion-button>


    <div class="flex items-center">
      <span>No account yet?</span> 
      <ion-button 
        color="primary" 
        fill="clear" 
        (click)="toggleToSignup.emit()"
      >
        signup
      </ion-button>
    </div> -->
  `,
  styles: [`
  /*
    app-list {
      --items-outline-width: 1px;
      --items-outline-color: var(--ion-color-medium);
      --footer-color: var(--ion-color-danger);
    }

    app-list.focused {
      --items-outline-width: 2px;
      --items-outline-color: var(--ion-color-dark);
    }

    app-list.invalid {
      --items-outline-color: var(--ion-color-danger);
    }

    app-list.focused.invalid {
      --items-outline-width: 2px;
      --items-outline-color: var(--ion-color-danger);
    }
    */
  `]
})
export class LoginForm {
  login = output<{email: string, password: string}>()
  toggleToSignup = output<void>()

  model = signal<{email: string, password: string}>({
    email: 'a',
    password: ''
  })

  form = form(this.model, (schema) => {
    email(schema.email, {message: 'Must be a valid email'})
  })

  isEmailCtlFocused = signal(false)

  onEmailCtlFocus() {
    this.isEmailCtlFocused.set(true)
  }

  onEmailCtlBlur() {
    this.isEmailCtlFocused.set(false)
  }

  hasError(ctl: FieldState<string, string>, kind?: string) {
    if(kind !== undefined && ctl.errors().find(err => err.kind === kind)) {
      return true
    }
    if(kind === undefined && ctl.errors().length > 0) {
      return true
    }
    return false
  }
}