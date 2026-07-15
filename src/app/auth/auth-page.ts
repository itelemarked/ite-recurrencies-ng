import { Component, inject } from "@angular/core";
import { IonContent, IonHeader, IonTitle, IonToolbar } from "@ionic/angular/standalone";

import { LoginForm } from "./components/login-form";
import { SignupForm } from "./components/signup-form";
import { AuthService } from "./services/auth-service";

@Component({
  selector: 'app-auth-page',
  standalone: true,
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    LoginForm,
    SignupForm
  ],
  template: `
    <ion-header collapse="fade" [translucent]="true">
      <ion-toolbar>
        <ion-title>
          Authenticate
        </ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content [forceOverscroll]="false" class="ion-padding-horizontal">
      @if(loginOrSignup === 'login') {
        <app-login-form
          (login)="onLogin($event)"
        />
      }
      @else {
        <app-signup-form/>
      }
    </ion-content>
  `,
  styles: [``]
})
export class AuthPage {
  private authService = inject(AuthService)

  loginOrSignup: 'login' | 'signup' = 'login'

  onLogin = ({email, password}: {email: string, password: string}) => this.authService.login(email, password)
}