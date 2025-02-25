import { Component, computed, inject, signal } from '@angular/core';
import {
  IonAlert,
  IonButton,
  IonContent,
  IonHeader,
  IonInput,
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
  ],
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>Testing</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content [forceOverscroll]="false">

      <!-- <auth-authenticate-form /> -->

      <ion-input></ion-input>

      <app-input
        type="text"
        label="Email"
        [formControl]="email"
      />

      <app-input
        type="password"
        label="Password"
        [(ngModel)]="passwordValue"
        [disabled]="passwordDisabled"
      />

    </ion-content>
  `,
  styles: ``,
})
export class TestingPage {

  email = new FormControl({value: 'aaa@aaa.com', disabled: false}, Validators.required)

  passwordValue = signal('111111')
  passwordDisabled = false
  

  ngOnInit() {
    setTimeout(() => {
      // this.email.setValue('bbb@bbb')
      // this.passwordValue.set('22222')

      // this.email.disable()
      // this.passwordDisabled = true
    }, 3000);
  }
}
