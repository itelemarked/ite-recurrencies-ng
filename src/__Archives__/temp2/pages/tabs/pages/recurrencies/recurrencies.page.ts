import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IonContent, IonHeader, IonList, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { RecurrencyListItemComponent } from './components/recurrency-list-item/recurrency-list-item.component';


@Component({
  selector: 'app-tab-recurrencies',
  standalone: true,
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonList,
    RecurrencyListItemComponent
  ],
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>Recurrency List</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content [forceOverscroll]="false">
      <ion-list>
        <app-recurrency-list-item></app-recurrency-list-item>
        <app-recurrency-list-item></app-recurrency-list-item>
        <app-recurrency-list-item></app-recurrency-list-item>
      </ion-list>
    </ion-content>
  `,
  styles: ``,
})
export class RecurrenciesPage {} 