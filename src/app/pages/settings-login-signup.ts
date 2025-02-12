import { Component } from '@angular/core';

import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';


@Component({
  selector: 'app-settings-login-signup',
  standalone: true,
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButtons,
    IonBackButton,
  ],
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-buttons>
          <ion-back-button text="" defaultHref="/tabs/home"></ion-back-button>
        </ion-buttons>
        <ion-title>Login</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content [forceOverscroll]="false">
      <p>SettingsLoginSignupPage works</p>
    </ion-content>
  `,
  styles: ``,
})
export class SettingsLoginSignupPage {

}
