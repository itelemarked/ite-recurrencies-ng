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
  

  constructor() { 
    this.createDb()
    // this.demo2()
    // this.demo3()
    // this.demo4()
    // this.demo4a().then(console.log).catch(console.log)
  }

  createDb() {
    openDB('db1', 1, {
      upgrade(db) {
        db.createObjectStore('users/abcd/recurrencies');
        db.createObjectStore('users');
      },
    });
  }

  demo1() {
    openDB('db1', 1, {
      upgrade(db) {
        db.createObjectStore('store1');
        db.createObjectStore('store2');
      },
    });
    openDB('db2', 1, {
      upgrade(db) {
        db.createObjectStore('store3', { keyPath: 'id' });
        db.createObjectStore('store4', { autoIncrement: true });
      },
    });
  }

  async demo2() {
    const db1 = await openDB('db1', 1);
    db1.add('store1', 'hello world', 'message');
    db1.add('store1', true, 'delivered');
    db1.close();
  }

  async demo3() {
    const db1 = await openDB('db1', 1);
    db1
      .add('store1', {title: 'hello again!!'}, 'new message')
      .then(result => {
        console.log('success!', result);
      })
      .catch(err => {
        console.error('error man: ', err);
      });
    db1.close();
  }

  async demo4() {
    const db2 = await openDB('db2', 1);
    db2.add('store3', { id: 'cat001', strength: 10, speed: 10 });
    db2.add('store3', { id: 'cat002', strength: 11, speed: 9 });
    db2.add('store4', { id: 'cat003', strength: 8, speed: 12 });
    db2.add('store4', { id: 'cat004', strength: 12, speed: 13 });
    db2.close();
  }

  async demo4a() {
    const db2 = await openDB('db2', 1);
    return db2.delete('users/abcd/recurrencies', 'cat002')
  }

}