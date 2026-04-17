import { Component, computed, output, signal } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { AppList } from '../../shared/components/app-list';
import { email, form, minLength, required, FormField } from '@angular/forms/signals';

interface LoginFormInterface {
  email: string;
  password: string;
}

@Component({
  selector: 'app-login-form',
  imports: [IonicModule, AppList, FormField],
  template: `
    <app-list>
      <div appListHeader>Email</div>

      <ion-list appListItems [inset]="true">
        <ion-item [style.--color]="emailTextColor()">
          <ion-input 
            type="text" 
            placeholder="Enter an email" 
            [formField]="loginForm.email" 
            (ionInput)="onEmailInput()"
          />
        </ion-item>
      </ion-list>

      <div appListFooter>
        @if (loginForm.email().touched() && loginForm.email().invalid()) {
          <ion-text color="danger">
            <ul>
              @for (error of loginForm.email().errors(); track error) {
                <li>{{ error.message }}</li>
              }
            </ul>
          </ion-text>
        }
      </div>
    </app-list>

    <app-list>
      <div appListHeader>Password</div>

      <ion-list appListItems [inset]="true">
        <ion-item [style.--color]="passwordTextColor()">
          <ion-input 
            type="password" 
            placeholder="Enter a password" 
            [formField]="loginForm.password" 
            (ionInput)="onPasswordInput()"
          />
        </ion-item>
      </ion-list>

      <div appListFooter>
        @if (loginForm.password().touched() && loginForm.password().invalid()) {
          <ion-text color="danger">
            <ul>
              @for (error of loginForm.password().errors(); track error) {
                <li>{{ error.message }}</li>
              }
            </ul>
          </ion-text>
        }
      </div>
    </app-list>

    <div class="mt-10">
      <ion-button expand="block" [disabled]="this.loginForm().invalid()" (click)="onLogin()">Login</ion-button>
    </div>
  `,
  styles: [``],
})
export class LoginForm {
  // DEPENDENCIES

  // STATE
  loginOutput = output<LoginFormInterface>({alias: 'login'})

  private loginModel = signal<LoginFormInterface>({
    email: '',
    password: '',
  });

  protected loginForm = form(this.loginModel, (schemaPath) => {
    required(schemaPath.email, { message: 'Email is required' });
    email(schemaPath.email, { message: 'Enter a valid email address' });
    required(schemaPath.password, { message: 'Password is required' });
    minLength(schemaPath.password, 6, { message: 'Password must be at least 6 characters long' });
  });

  // SELECTORS
  emailTextColor = computed(() => {
    const touched = this.loginForm.email().touched()
    const invalid = this.loginForm.email().invalid()
    return touched && invalid ? 'var(--ion-color-danger)' : undefined;
  })

  passwordTextColor = computed(() => {
    const touched = this.loginForm.password().touched()
    const invalid = this.loginForm.password().invalid()
    return touched && invalid ? 'var(--ion-color-danger)' : undefined;
  })

  // ACTIONS
  onEmailInput = () => {
    this.loginForm.email().reset()
  }

  onPasswordInput = () => {
    this.loginForm.password().reset()
  }

  onLogin = () => {
    this.loginOutput.emit({
      email: this.loginForm.email().value(),
      password: this.loginForm.password().value()
    })
  }

  // PRIVATE
}
