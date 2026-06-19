import { Component } from "@angular/core";
import { IonContent, IonHeader, IonTitle, IonToolbar } from "@ionic/angular/standalone";

import { LoginForm } from "./components/login-form";
import { SignupForm } from "./components/signup-form";

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
    <ion-content [forceOverscroll]="false" class="ion-padding">
      @if(loginOrSignup === 'login') {
        <app-login-form/>
      }
      @else {
        <app-signup-form/>
      }
    </ion-content>
  `,
  styles: [``]
})
export class AuthPage {
  loginOrSignup: 'login' | 'signup' = 'login'
}