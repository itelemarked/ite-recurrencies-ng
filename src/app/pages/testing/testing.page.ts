
import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  IonButton,
  IonContent,
  IonHeader,
  IonLoading,
  IonProgressBar,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { BehaviorSubject, catchError, combineLatest, delay, interval, map, Observable, of, startWith, switchMap, take, tap } from 'rxjs';

import {delay as delayFn} from '@app/utils/testing'
import { Settings5Service } from '@app/services/settings5.service';
import { Auth5Service } from '@app/services/auth5.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { BackdropDirective } from '@app/directives/backdrop.directive';




@Component({
  selector: 'app-testing',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButton,
    IonProgressBar,
    IonLoading,
    BackdropDirective
],
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>Testing</ion-title>
        <ion-progress-bar [type]="settingsService.isLoading() || authService.isLoading() ? 'indeterminate' : 'determinate'"/>
        <!-- <ion-progress-bar [buffer]="settingsService.isLoading() || authService.isLoading() ? 0 : 1" [reversed]="true"/> -->
      </ion-toolbar>
    </ion-header>

    <ion-content [forceOverscroll]="false" class="ion-padding">

      <!-- <ion-loading [isOpen]="settingsService.isLoading() || authService.isLoading()"/> -->
      <!-- <ion-loading appBackdrop [isOpen]="true"/> -->
      
      <div>User</div>
      <div class="outline">
        <div class="flex items-center px-md my-md">
          <span class="flex-1">User info:</span>
          <span> {{ userInfo() }}</span>
        </div>
        <div class="flex">
          <ion-button class="flex-1" size="small" (click)="authService.login('aaa@aaa.com', '111111')">login aaa</ion-button>
          <!-- <ion-button class="flex-1" size="small" (click)="wrongLogin()">login aaa</ion-button> -->
          <ion-button class="flex-1" size="small" (click)="authService.login('bbb@bbb.com', '222222')">login bbb</ion-button>
          <ion-button class="flex-1" size="small" color="danger" (click)="authService.logout()">Logout</ion-button>
        </div>
      </div>

      <div class="mt-md">Settings</div>
      <div>
        <div class="flex item-center outline">
          <span class="flex-1">dateFormat</span>
          <span>{{ dateFormat() }}</span>
        </div>
      </div>

    </ion-content>
  `,
  styles: `
    .outline {
      border: solid 1px grey;
      min-height: 50px;
    }

    ion-loading {
      
      --background: transparent;
    }
  `,
})
export class TestingPage {

  settingsService = inject(Settings5Service)
  authService = inject(Auth5Service)

  userInfo = computed(() => {
    const usr = this.authService.user()
    if(usr === undefined) return 'loading'
    if(usr === null) return 'data-not-found'
    return usr.email
  })

  fbStore = inject(AngularFirestore)
  fbAuth = inject(AngularFireAuth)

  dateFormat = computed(() => {
    const res = this.settingsService.settings()
    if(res === undefined) return 'loading'
    if(res === null) return 'data-not-found'
    return res.dateFormat
  })

  constructor() {
    
  }

  wrongLogin() {
    this.authService.login('aaa@aaa.com', '11111').catch(err => {
      console.log('wrongLogin()')
    })
  }

}

