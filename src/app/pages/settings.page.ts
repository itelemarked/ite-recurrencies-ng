import { Component, inject } from '@angular/core';

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
  IonList,
  IonLoading,
  IonNote,
  IonSkeletonText,
  IonSpinner,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { personCircleOutline } from 'ionicons/icons';

import { AppListComponent } from '../components/app-list.component';
import { User } from '../types/User';
import { NgIf } from '@angular/common';
import { RouterLinkDirective } from '../directives/router-link.directive';
import { BlurOnClickDirective } from '../directives/blur-on-click.directive';
import { RouterLink } from '@angular/router';
import { BackdropDirective } from '../directives/backdrop.directive';
import { Auth2Service } from '../services/auth2.service';
import { SkeletonDirective } from '../directives/skeleton.directive';
import { ContentLoadingComponent } from '../_temp_/content-loading.component';

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
    AppListComponent,
    IonButton,
    RouterLink,
    RouterLinkDirective,
    IonAlert,
    NgIf,
    BlurOnClickDirective,
    BackdropDirective,
    SkeletonDirective,
    IonSkeletonText,
    IonLoading,
    IonSpinner,
    ContentLoadingComponent,
    IonList
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
    
      <!-- <app-content-loading *ngIf="authService.isLoading()" /> -->
      <!-- <app-content-loading /> -->

      <app-list
        class="mt-lg"
        [inset]="true"
        header="USER"
      >
        <header>USER</header>
        <ion-list *ngIf="authService.isLoggedIn()">
          <ion-item class="app-user-item">
            <ion-icon name="person-circle-outline" slot="start" />
            <ion-label>{{ authService.user()!.email }}</ion-label>
            <ion-button color="danger" fill="outline" appBlurOnClick (click)="confirmLogoutAlert.show = true">logout</ion-button>
          </ion-item>
        </ion-list>

        <ion-list *ngIf="authService.isLoggedOut()">
          <ion-item class="app-user-item" button appBlurOnClick routerLink="/settings/login">
            <ion-icon name="person-circle-outline" slot="start" color="danger" />
            <ion-label>Need to login?</ion-label>
          </ion-item>
        </ion-list>

        <!-- <main *ngIf="authService.isLoading()"> -->
        <!-- <main>
          <ion-item class="app-user-item">
            <ion-icon appSkeleton class="rounded-full" slot="start" />
            <ion-label appSkeleton class="rounded-md">skeleton-loading-user</ion-label>
          </ion-item> 
        </main>-->
        <footer>**Logged-in users have their datas backed-up on a google server. The datas of unregistered users are stored in the browser memory (data lost is not guaranteed...)**</footer>
      </app-list>

      <app-list class="mt-lg" [inset]="true">
        <header>Settings</header>
        <ion-list>
          <ion-item [button]="true" appBlurOnClick routerLink="/settings/dateformat">
            <ion-label>Date format</ion-label>
            <ion-note>**01.06.2025**</ion-note>
          </ion-item>
          <ion-item [button]="true" appBlurOnClick routerLink="/settings/timezone">
            <ion-label>Timezone</ion-label>
            <ion-note>**Europe/Zurich**</ion-note>
          </ion-item>
        </ion-list>
      </app-list>

      <ng-container *ngIf="authService.user() !== null">
        <ion-alert
          appBackdrop
          [isOpen]="confirmLogoutAlert.show"
          [header]="confirmLogoutAlert.options.header"
          [backdropDismiss]="confirmLogoutAlert.options.backdropDismiss"
          [buttons]="confirmLogoutAlert.options.buttons"
          (didDismiss)="confirmLogoutAlert.show = false"
        />
      </ng-container>
      
    </ion-content>
  `,
  styles: `
    .app-user-item ion-icon {
      font-size: 3.5em;
    }

    .user-icon-skeleton {
      display: inline-block;
      border-radius: 50px;
      padding: 5px;
      height: 3em;
      width: 3em;
      margin-left: 4px;
    }

    .user-label-skeleton {
      display: inline-block;
      height: 0.8em;
      width: 200px;
    }
  `,
})
export class SettingsPage {

  // - when clicking on alert backdrop, a error "Blocked aria-hidden on an element because its descendant retained focus."
  // - when accessing Settings page, user item flickering on load. --> load user before accessing SettingsPage?

  // DEPENDENCIES
  authService = inject(Auth2Service)


  // VARS
  
  // TODO: everything in the template??
  confirmLogoutAlert: {show: boolean, options: AlertOptions} = {
    show: false,
    options: {
      header: 'Do you really want to logout?',
      backdropDismiss: false,
      buttons: [
        {
          text: 'cancel',
          handler: () => {
            console.log('cancel clicked')
          }
        },
        {
          text: 'OK',
          handler: () => {
            this.authService.logout()
          }
        }
      ]
    }
  }

  constructor() {
    addIcons({ personCircleOutline })
  }

}
