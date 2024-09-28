import { Component, effect, ElementRef, inject, OnInit, signal, viewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormsModule } from '@angular/forms';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonButtons, IonModal, IonDatetime, IonInput } from '@ionic/angular/standalone';
import { combineLatestWith, concatMap, delay, firstValueFrom, from, fromEvent, interval, lastValueFrom, map, mergeMap, Observable, of, switchMap, take, tap } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { toObservable } from '@angular/core/rxjs-interop'
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { SettingsService } from '../settings/settings.service';
import { ISettings } from '../_interfaces/ISettings';
import { RecurrencyService } from '../recurrency/recurrency.service';
import { toPeriodUnit } from '../_types/PeriodUnit';
import { toPositiveInteger } from '../_types/PositiveInteger';
import { toDateString } from '../_types/DateString';
import { IRecurrencyData, toRecurrency } from '../_interfaces/IRecurrency';
import { IUser } from '../_interfaces/IUser';
import { openDB } from 'idb';

@Component({
  selector: 'app-test',
  standalone: true,
  imports: [FormsModule, IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonButtons, IonModal, IonDatetime, IonInput],
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>TestPage</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content [forceOverscroll]="false">

      <p>TestPage works</p>
      <ion-button #btn>Click me</ion-button>
    
    </ion-content>
  `,
  styles: ``,
})
export class TestPage {

  btn = viewChild('btn', {read: ElementRef})
  auth = inject(AngularFireAuth)
  
  constructor() {}

}