import { Component, effect, ElementRef, inject, OnInit, signal, viewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormsModule } from '@angular/forms';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonButtons, IonModal, IonDatetime, IonInput } from '@ionic/angular/standalone';
import { combineLatestWith, concatMap, delay, firstValueFrom, from, fromEvent, interval, lastValueFrom, map, mergeMap, Observable, of, switchMap, take, tap } from 'rxjs';
import { RecurrencyService2 } from '../recurrency/recurrency.service2';
import { toRecurrency } from '../_interfaces/IRecurrency';
import { AuthService } from '../auth/auth.service';

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
  auth = inject(AuthService)
  afStore = inject(AngularFirestore)
  recurrencyService = inject(RecurrencyService2)

  constructor() {}

}