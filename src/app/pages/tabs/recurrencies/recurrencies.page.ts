import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';

import { RecurrencyListItemComponent } from './recurrency-list-item/recurrency-list-item.component';

@Component({
  selector: 'app-tab-recurrencies',
  standalone: true,
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    RecurrencyListItemComponent
  ],
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>Recurrency List</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content [forceOverscroll]="false">
      
    </ion-content>
  `,
  styles: ``,
})
export class TabsRecurrenciesPage {} 