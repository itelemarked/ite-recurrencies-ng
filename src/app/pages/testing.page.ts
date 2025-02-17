
import { Component, computed, inject } from '@angular/core';
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
    IonItemDivider
  ],
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>Testing</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content [forceOverscroll]="false" class="ion-padding">

      <!-- <section class="user-info" style="border: 1px solid var(--ion-color-medium); border-radius: 10px; margin-top: 10px; padding: 10px;">
        <p>User email: {{ userInfo() }}</p>
        <ion-button expand="block" color="danger" (click)="onLogout()">logout</ion-button>
      </section>

      <section class="app-login" style="border: 1px solid var(--ion-color-primary); padding: 10px; border-radius: 10px; margin-top: 20px;">
        <ion-button size="small" fill="outline" (click)="logAaa()">aaa</ion-button>
        <ion-input label="Email" [(ngModel)]="email" />
        <ion-input label="Password" [(ngModel)]="password" />
        <ion-button expand="block" (click)="onLogin()">login</ion-button>
      </section>

      <section class="recurrencies" style="border: 1px solid var(--ion-color-medium); border-radius: 10px; margin-top: 10px; padding: 10px;">
        <p *ngIf="recurrencyService.recurrencies() === undefined">Recurrencies are loading...</p>
        <ul *ngIf="recurrencyService.recurrencies() !== undefined">
          <li *ngFor="let recurrency of recurrencyService.recurrencies()">
            {{ recurrency.title }}
          </li>
        </ul>
      </section> -->

      <h1>Some paragraph here...</h1>
      <p>Some other paragraph here...</p>

      <div style="margin: 20px;">aaa</div>

      <app-list [inset]="true">
        <header>List header</header>
        <ion-list [inset]="true">
          <ion-item>
            <ion-label>a</ion-label>
          </ion-item>
          <ion-item>
            <ion-label>b</ion-label>
          </ion-item>
        </ion-list>
        <footer>List footer</footer>
      </app-list>

      <ion-list [inset]="true">
        <ion-item>
          <ion-label>a</ion-label>
        </ion-item>
        <ion-item>
          <ion-label>b</ion-label>
        </ion-item>
      </ion-list>

      <!-- <ion-list [inset]="true">
        <ion-item>
          <ion-label>a</ion-label>
        </ion-item>
        <ion-item>
          <ion-label>b</ion-label>
        </ion-item>
      </ion-list> -->


    </ion-content>
  `,
  styles: `
    .app-list-icon {
      font-size: 3.5em;
    }
  `,
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

  email = ''
  password = ''

  constructor() {
    addIcons({ personCircleOutline })
  }

  onLogin() {
    this.authService.login(this.email, this.password)
    this.email = this.password = ''
  }

  onLogout() {
    this.authService.logout()
  }

  logAaa() {
    this.email = 'aaa@aaa.com'
    this.password = '111111'
    this.onLogin()
  }

}
