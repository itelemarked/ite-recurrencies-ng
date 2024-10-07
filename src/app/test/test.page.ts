import { Component, effect, ElementRef, inject, OnInit, signal, viewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormsModule } from '@angular/forms';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonButtons, IonModal, IonDatetime, IonInput } from '@ionic/angular/standalone';
import { combineLatestWith, concatMap, delay, firstValueFrom, from, fromEvent, interval, lastValueFrom, map, mergeMap, Observable, of, switchMap, take, tap } from 'rxjs';
import { AuthService2 } from '../auth/auth.service2';
import { RecurrencyService2 } from '../recurrency/recurrency.service2';
import { toRecurrency } from '../_interfaces/IRecurrency';

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
  auth = inject(AuthService2)
  afStore = inject(AngularFirestore)
  recurrencyService = inject(RecurrencyService2)

  constructor() {
    const {id, ...rec} = toRecurrency({
      lastEvent: "2024-08-20",
      periodNb: 98,
      periodUnit: "days",
      title: "PC-7"
    })

    if(id === undefined) {
      this.recurrencyService.add(rec).then(val => {
        console.log('add()')
        console.log(val)
      })
    } else {
      this.recurrencyService.set(id, rec).then(val => {
        console.log('set()')
        console.log(val)
      })
    }
    
    // this.recurrencyService.add(rec).then(val => console.log(val))
    // this.recurrencyService.remove('abcdef').then(val => console.log(val))
  }

}