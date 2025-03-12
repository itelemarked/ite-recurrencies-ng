import { Component, inject, signal, WritableSignal } from '@angular/core';
import { NgIf } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

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

import { ContentLoadingComponent } from '../../__temp__/content-loading.component';

import { AppListComponent } from '../../_shared/components/app-list.component';
import { User } from '../../_shared/types/User';
import { RouterLinkDirective } from '../../_shared/directives/router-link.directive';
import { blurActiveElement, BlurOnClickDirective } from '../../_shared/directives/blur-on-click.directive';
import { BackdropDirective } from '../../_shared/directives/backdrop.directive';
import { Auth2Service } from '../../_shared/services/auth2.service';
import { SkeletonDirective } from '../../_shared/directives/skeleton.directive';
import { UserState2Component } from '../../_shared/components/user-state2.component';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkDirective,
    NgIf,
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
    IonButton,
    IonList,
    IonAlert,
    IonLoading,
    IonSpinner,
    IonSkeletonText,
    BlurOnClickDirective,
    BackdropDirective,
    SkeletonDirective,
    ContentLoadingComponent,
    AppListComponent,
    UserState2Component
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

    <ion-content [forceOverscroll]="false" class="ion-padding">

      <user-state2
       [user]="userList.user()"
       (login)="userList.onLogin()" 
       (logout)="userList.onLogout()"
      />

      <app-list>
        <header>DATE SETTINGS</header>
        <ion-list [inset]="true">
          <ion-item [button]="true" appBlurOnClick routerLink="/settings/dateformat-options">
            <ion-label>Date format</ion-label>
            <ion-note>**01.06.2025**</ion-note>
          </ion-item>
          <ion-item [button]="true" appBlurOnClick routerLink="/settings/timezone-options">
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
  router = inject(Router)


  // TEMP/TODO: replace USER by an AuthService!
  USER: WritableSignal<User | null> = signal(null)


  // VARS
  userList = {
    user: this.USER,
    onLogin: () => {
      blurActiveElement()
      this.router.navigateByUrl('/settings/authenticate')
    },
    onLogout: () => {
      this.USER.set(null)
    }
  }

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

  ngOnInit() {}

}
