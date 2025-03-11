
import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonButton,
  IonContent,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonItemDivider,
  IonLabel,
  IonList,
  IonSkeletonText,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { personCircleOutline } from 'ionicons/icons';

import { Auth2Service } from '../services/auth2.service';
import { FormsModule } from '@angular/forms';
import { Recurrency2Service } from '../services/recurrency2.service';
import { SkeletonDirective } from '../directives/skeleton.directive';
import { AppListComponent } from '../components/app-list.component';
import { EncapsulationNoneComponent } from '../_temp_/encapsulation-none.component';
import { EncapsulationEmulatedComponent } from '../_temp_/encapsulation-emulated.component';
import { EncapsulationShadowDomComponent } from '../_temp_/encapsulation-shadow-dom.component';
import { AppInput2Component } from '../components/app-input2.component';


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
    IonInput,
    IonItem,
    IonIcon,
    IonLabel,
    IonSkeletonText,
    SkeletonDirective,
    IonList,
    AppListComponent,
    IonItemDivider,
    EncapsulationNoneComponent,
    EncapsulationEmulatedComponent,
    EncapsulationShadowDomComponent,
    AppInput2Component
  ],
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>Testing</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content [forceOverscroll]="false" class="p-xl">

      <div>testing</div>

    </ion-content>
  `,
  styles: ``,
})
export class TestingPage {

  authService = inject(Auth2Service)
  recurrencyService = inject(Recurrency2Service)

  userInfo = computed(() => {
    const user = this.authService.user()
    switch (user) {
      case undefined: return 'User loading...' 
      case null: return 'No registered user...' 
      default: return user.email
    }
  })

  email = signal('aaa@aa.com')
  emailDisabled = signal(false)
  password = ''

  constructor() {
    addIcons({ personCircleOutline })
    // setTimeout(() => {
    //   this.emailDisabled.set(true)
    //   // this.email.set('bbb@bbb.com')
    // }, 3000);
  }

}
