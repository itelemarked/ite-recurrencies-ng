import { Component } from '@angular/core';

import {
  AlertOptions,
  IonAlert,
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonNote,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { personCircleOutline } from 'ionicons/icons';

import { ListComponent } from '../components/list.component';
import { User } from '../types/User';
import { NgIf } from '@angular/common';
import { RouterLinkDirective } from '../directives/router-link';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonItem,
    IonLabel,
    IonButtons,
    IonBackButton,
    IonIcon,
    IonNote,
    ListComponent,
    IonButton,
    RouterLinkDirective,
    IonAlert,
    NgIf
  ],
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-buttons>
          <ion-back-button text="" defaultHref="/tabs/home"></ion-back-button>
        </ion-buttons>
        <ion-title>Settings</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content [forceOverscroll]="false">
      <app-list
        class="mt-lg"
        [inset]="true"
        header="USER"
        footer="**Logged-in users have their datas backed-up on a google server. The datas of unregistered users are stored in the browser memory (data lost is not guaranteed...)**"
      >
        <ng-container *ngIf="user !== null">
          <ion-item class="app-user-item">
            <ion-icon name="person-circle-outline" slot="start"></ion-icon>
            <ion-label>** {{ user.email }} **</ion-label>
            <ion-button id="confirm-logout" color="danger" fill="outline">logout</ion-button>
          </ion-item>
        </ng-container>

        <ng-container *ngIf="user === null">
          <ion-item class="app-user-item" button appRouterLink="/settings/login">
            <ion-icon name="person-circle-outline" slot="start" color="danger"></ion-icon>
            <ion-label>Need to login?</ion-label>
          </ion-item>
        </ng-container>
      </app-list>

      <app-list class="mt-lg" [inset]="true" header="SETTINGS">
        <ion-item [button]="true" appRouterLink="/settings/dateformat">
          <ion-label>Date format</ion-label>
          <ion-note>**01.06.2025**</ion-note>
        </ion-item>
        <ion-item [button]="true" appRouterLink="/settings/timezone">
          <ion-label>Timezone</ion-label>
          <ion-note>**Europe/Zurich**</ion-note>
        </ion-item>
      </app-list>

      <ng-container *ngIf="user !== null">
        <ion-alert
          trigger="confirm-logout"
          [header]="confirmLogoutAlert.header"
          [buttons]="confirmLogoutAlert.buttons"
        />
      </ng-container>

    </ion-content>
  `,
  styles: `
    .app-user-item ion-icon {
      font-size: 3.5em;
    }
  `,
})
export class SettingsPage {

  user: User | null = { uid: 'abcdef', email: 'aaa@aaa.com' }
  // user: User | null = null
  

  confirmLogoutAlert: AlertOptions = {
    header: 'Do you really want to logout?',
    buttons: [
      {
        text: 'cancel',
        handler: () => console.log('cancel clicked')
      },
      {
        text: 'OK',
        handler: () => console.log('ok clicked')
      }
    ]
  }

  constructor() {
    addIcons({ personCircleOutline });
  }

  ngOnDestroy() {
    console.log('SettingsPage destroyed')
  }
}
