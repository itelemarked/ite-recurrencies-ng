
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
import { isTimezone, Timezone } from '../../types/Timezone.enum';
import { SettingsService } from '../../services/settings.service';
import { BehaviorSubject, distinctUntilChanged, interval, map, Observable, of, startWith, switchMap, take, tap } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AuthService } from '@app/services/auth.service';
import { testAllTypes } from '@app/utils/testing';
import { Auth2Service } from '@app/services/auth2.service';
import { DataRequest } from '@app/types/DataRequest.type';
import { Settings2Service } from '@app/services/settings2.service';


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
    IonButton
],
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>Testing</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content [forceOverscroll]="false" class="ion-padding">
      
      <div>User</div>
      <div class="outline">
        <div class="flex items-center px-md my-md">
          <span class="flex-1">User info:</span>
          <span> {{ userInfo() }}</span>
        </div>
        <div class="flex">
          <ion-button class="flex-1" size="small" (click)="authService.login('aaa@aaa.com', '111111')">login aaa</ion-button>
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
  `,
})
export class TestingPage {

  settingsService = inject(Settings2Service)
  authService = inject(Auth2Service)

  userInfo = computed(() => {
    const usr = this.authService.user()
    if(usr.state === 'loading') return 'loading'
    if(usr.state === 'data-not-found') return 'data-not-found'
    return usr.value.email
  })

  fbStore = inject(AngularFirestore)
  fbAuth = inject(AngularFireAuth)

  dateFormat = computed(() => {
    const res = this.settingsService.dateFormat()
    if(res === undefined) return 'undefined'
    if(res === null) return 'null'
    return res
  })

  constructor() {

    this.settingsService.fbSettings$.subscribe()

    // this.authService.user$.pipe(
    //   tap(usrReq => {
    //     if(usrReq.state === 'loading') {
    //       console.log('user: loading')
    //     } else if(usrReq.state === 'data-not-found') {
    //       console.log('user: data-not-found')
    //     } else {
    //       console.log(`user: ${usrReq.value.email}`)
    //     }
    //   }),
    //   switchMap((usrReq) => {
    //     if(usrReq.state === 'loading') {
    //       return of({state: 'loading'} as DataRequest<{timezone: Timezone, dateFormat: DateFormat}>)
    //     }
    //     if(usrReq.state === 'data-not-found') {
    //       return of({state: 'data-not-found'} as DataRequest<{timezone: Timezone, dateFormat: DateFormat}>).pipe(
    //         startWith({state: 'loading'} as DataRequest<{timezone: Timezone, dateFormat: DateFormat}>),
    //         tap(res => {
    //           if(res.state === 'loading') {
    //             console.log('settings: loading')
    //           } else if(res.state === 'data-not-found') {
    //             console.log('settings: data-not-found')
    //           } else {
    //             console.log(`settings: ${res.value}`)
    //           }
    //         }),
    //       )
    //     }

    //     return this.fbStore.doc<{timezone: Timezone, dateFormat: DateFormat}>(`users/${usrReq.value.uid}/settings/SETTINGS_UID`).snapshotChanges().pipe(
    //       map((res): DataRequest<{timezone: Timezone, dateFormat: DateFormat}> => {
    //         const data = res.payload.data()
    //         if(data === undefined) return {state: 'data-not-found'}
    //         return {state: 'data-found', value: data}
    //       }),
    //       startWith({state: 'loading'} as DataRequest<{timezone: Timezone, dateFormat: DateFormat}>),
    //       tap(res => {
    //         if(res.state === 'loading') {
    //           console.log('settings: loading')
    //         } else if(res.state === 'data-not-found') {
    //           console.log('settings: data-not-found')
    //         } else {
    //           console.log(`settings: ${res.value}`)
    //         }
    //       }),
    //     )
    //   }),
      
    // ).subscribe()






    // this.fbAuth.authState.pipe(
    //   tap(usr => {
    //     if(usr === undefined) {
    //       console.log('user: undefined')
    //     } else if(usr === null) {
    //       console.log('user: null')
    //     } else {
    //       console.log(`user: ${usr.email}`)
    //     }
    //   })
    // ).subscribe()
  }



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