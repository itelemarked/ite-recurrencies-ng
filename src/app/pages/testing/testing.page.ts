
import { Component, computed, inject, Injector } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  IonButton,
  IonContent,
  IonHeader,
  IonItem,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { format, getPlatformTimezone } from '../../utils/date';
import { DateFormat, isDateFormat } from '../../types/DateFormat.enum';
import { Timezone } from '../../types/Timezone.enum';
import { SettingsService } from '../../services/settings.service';
import { BehaviorSubject, distinctUntilChanged, interval, map, of, startWith, take } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AuthService } from '@app/services/auth.service';


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
    IonItem
],
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>Testing</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content [forceOverscroll]="false" class="ion-padding">
      
      <div class="flex items-center px-md my-md outline">
        <span class="flex-1">User info:</span>
        <span> {{ userInfo() }}</span>
      </div>

      <div class="flex items-center px-md my-md outline">
        <span class="flex-1">Log 'aaa' in</span>
        <ion-button size="small" (click)="authService.login('aaa@aaa.com', '111111')">aaa</ion-button>
      </div>

      <div class="flex items-center px-md my-md outline">
        <span class="flex-1">Log 'bbb' in</span>
        <ion-button size="small" (click)="authService.login('bbb@bbb.com', '222222')">bbb</ion-button>
      </div>

      <div class="flex items-center px-md my-md outline">
        <span class="flex-1">Logout</span>
        <ion-button size="small" color="danger" (click)="authService.logout()">Logout</ion-button>
      </div>

    </ion-content>
  `,
  styles: `
    .outline {
      border: solid 1px grey;
      height: 50px;
    }
  `,
})
export class TestingPage {

  settingsService = inject(SettingsService)
  authService = inject(AuthService)

  userInfo = computed(() => {
    const usr = this.authService.user()
    if(usr === undefined) return 'loading'
    if(usr === null) return 'not-authenticated'
    return usr.email
  })

  constructor() {}




  // settingsService = inject(SettingsService)

  // constructor() {
  //   this.settingsService.dateFormat$.subscribe(val => console.log(`dateFormat changed: ${val}`))
  //   this.settingsService.timezone$.subscribe(val => console.log(`timezone changed: ${val}`))
  //   this.settingsService.settings$.subscribe(val => {
  //     console.log(`settings changed:`)
  //     console.log(val)
  //   })
  // }

  // updateCH() {
  //   this.settingsService.update({dateFormat: DateFormat.CH})
  // }

  // updateUS() {
  //   this.settingsService.update({dateFormat: DateFormat.US})
  // }
  
  // updateZU() {
  //   this.settingsService.update({timezone: Timezone.EUROPE_ZURICH})
  // }

  // updateMAU() {
  //   this.settingsService.update({timezone: Timezone.INDIAN_MAURITIUS})
  // }

  // deleteDateFormat() {
  //   this.settingsService.delete(['dateFormat'])
  // }

  // deleteTimezone() {
  //   this.settingsService.delete(['timezone'])
  // }

  // deleteAll() {
  //   this.settingsService.delete()
  // }



  // fs = inject(AngularFirestore)
  // injector = inject(Injector)

  // dateFormat$ = this.fs.doc<any>(`users/0yuA0RLZFJdbRKtVSfW4y5HSQMq1/settings/SETTINGS_UID`).snapshotChanges().pipe(
  //   map(res => res.payload.data().dateFormat),
  //   distinctUntilChanged()
  // )

  // timezone$ = this.fs.doc<any>(`users/0yuA0RLZFJdbRKtVSfW4y5HSQMq1/settings/SETTINGS_UID`).snapshotChanges().pipe(
  //   map(res => res.payload.data().timezone),
  //   distinctUntilChanged()
  // )

  // dateFormat = this.getDateFormat(this.injector)
  // timezone = this.getTimezone(this.injector)

  

  // constructor() {
  //   this.dateFormat$.subscribe(val => console.log(`dateFormat changed: ${val}`))
  //   this.timezone$.subscribe(val => console.log(`timezone changed: ${val}`))
  // }

  // private getDateFormat(injector: Injector) {
  //   return toSignal(this.dateFormat$, {injector, initialValue: 'undefined'})
  // }

  // private getTimezone(injector: Injector) {
  //   return toSignal(this.timezone$, {injector, initialValue: 'undefined'})
  // }

  // changeDateFormat() {
  //   const n = Math.random()
  //   this.fs.doc<any>(`users/0yuA0RLZFJdbRKtVSfW4y5HSQMq1/settings/SETTINGS_UID`).update({dateFormat: n})
  // }

  // changeTimezone() {
  //   const n = Math.random()
  //   this.fs.doc<any>(`users/0yuA0RLZFJdbRKtVSfW4y5HSQMq1/settings/SETTINGS_UID`).update({timezone: n})
  // }

}