import { Component, inject } from '@angular/core';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';

import { AngularFirestore } from '@angular/fire/compat/firestore';
import { RecurrencyService } from '../services/recurrency.service';
import { Recurrency } from '../types/Recurrency';
import { toPositiveInteger } from '../types/PositiveInteger';
import { toPeriodUnit } from '../types/PeriodUnit';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-testing',
  standalone: true,
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
  ],
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>TESTING</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content [forceOverscroll]="false" class="ion-padding">
      <p>Testing works!</p>
    </ion-content>
  `,
  styles: ``,
})
export class TestingPage {

  firestore = inject(AngularFirestore)
  fireauth = inject(AngularFireAuth)
  recurrencyService = inject(RecurrencyService)
  userService = inject(UserService)

  constructor() {
    // this.firestore.doc<Recurrency>('users/0yuA0RLZFJdbRKtVSfW4y5HSQMq1/recurrencies/4BYFilgH2ySD44D4ux0w').delete()
    // this.recurrencyService.recurrencies$$.subscribe(console.log)
    // this.fireauth.signInWithEmailAndPassword('aaa@aaa.com', '111111').then(console.log).catch(console.log)

    this.recurrencyService.TEST()
    this.userService.TEST()
  }

} 