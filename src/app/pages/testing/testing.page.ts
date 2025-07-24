
import { Component, inject, Injector } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  IonButton,
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { format, getPlatformTimezone } from '../../utils/date';
import { DateFormat, isDateFormat } from '../../types/DateFormat.enum';
import { Timezone } from '../../types/Timezone.enum';
import { SettingsService } from '../../services/settings.service';
import { distinctUntilChanged, interval, map, of, take } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { AngularFirestore } from '@angular/fire/compat/firestore';


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

    <ion-content [forceOverscroll]="false" class="p-xl">
      <!-- <p>
        DateFormat: {{ settingsService.dateFormat() }} 
        <ion-button size="small" (click)="updateCH()">CH</ion-button>
        <ion-button size="small" (click)="updateUS()">US</ion-button>
        <ion-button size="small" (click)="deleteDateFormat()">delete</ion-button>
      </p>
      <p>
        Timezone: {{ settingsService.timezone() }}
        <ion-button size="small" (click)="updateZU()">Zurich</ion-button>
        <ion-button size="small" (click)="updateMAU()">Mauritius</ion-button>
        <ion-button size="small" (click)="deleteTimezone()">delete</ion-button>
      </p>
      <ion-button size="small" (click)="deleteAll()">deleteAll</ion-button> -->
    </ion-content>
  `,
  styles: ``,
})
export class TestingPage {

  settingsService = inject(SettingsService)

  constructor() {

    this.settingsService.settings$.subscribe(console.log)

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