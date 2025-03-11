import { Component } from '@angular/core';

import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
// import { UserAuthenticateComponent } from '../components/user-authenticate.component';


@Component({
  selector: 'app-settings-authenticate',
  standalone: true,
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButtons,
    IonBackButton
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
      <!-- <user-authenticate /> -->
    </ion-content>
  `,
  styles: ``,
})
export class SettingsAuthenticatePage {

}
