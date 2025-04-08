
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';

import { AuthService } from '@shared/services/auth.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { STORE } from '@shared/services/_MOCK_DATAS';
import { RecurrencyService } from '@shared/services/recurrency.service';
import { isNumber, isPlainObject, isString } from '@shared/utils/types-check/types-check';
import { UserServiceCheckComponent } from './user-service-check/user-service-check.component';
import { RecurrencyServiceCheckComponent } from "./recurrency-service-check.component.ts/recurrency-service-check.component";



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
    UserServiceCheckComponent,
    RecurrencyServiceCheckComponent
],
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>Testing</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content [forceOverscroll]="false" class="p-xl">

      <app-user-service-check />
      <app-recurrency-service-check />

    </ion-content>
  `,
  styles: ``,
})
export class TestingPage {

  authService = inject(AuthService)
  recurrencyService = inject(RecurrencyService)
  // fs = inject(AngularFirestore)

  constructor() {
    this.TEST()
  }

  private TEST() {
    
  }

}