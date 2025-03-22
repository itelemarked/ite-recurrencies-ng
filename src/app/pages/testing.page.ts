import { Component, computed, inject, signal } from '@angular/core';
import {
  IonAlert,
  IonButton,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonLoading,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';

import { Auth2Service } from '../services/auth2.service';
import { FormControl, FormsModule, NgModel, ReactiveFormsModule, Validators } from '@angular/forms';
import { Recurrency2Service } from '../services/recurrency2.service';
import { ContentLoadingComponent } from '../components/content-loading.component';
import { BackdropDirective } from '../directives/backdrop.directive';
import { AuthAuthenticateFormComponent } from '../components/temp/auth-authenticate-form.component';
import { AppInputComponent } from '../components/app-input.component';
import { TEST } from '../services/MOCK';



@Component({
  selector: 'app-testing',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    AuthAuthenticateFormComponent,
    AppInputComponent,
    IonInput,
    IonList,
    IonItem,
    IonLabel
  ],
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>Testing</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content [forceOverscroll]="false" class="ion-padding">

      <ion-list inset class="mx-0">
        <ion-item>
          <ion-label>a</ion-label>
        </ion-item>
        <ion-item>
          <ion-label>b</ion-label>
        </ion-item>
      </ion-list>

    </ion-content>
  `,
  styles: `
    ion-item {
      --background: var(--ion-color-light);
    }
  `,
})
export class TestingPage {

  email = new FormControl({value: 'aaa@aaa.com', disabled: false}, Validators.required)

  passwordValue = signal('111111')
  passwordDisabled = false
  

  ngOnInit() {
    TEST();
  }
}
