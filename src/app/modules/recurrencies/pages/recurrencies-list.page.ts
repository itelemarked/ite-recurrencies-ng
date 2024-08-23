import { Component } from '@angular/core';
import { IonButton, IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { Datum } from '../models/Datum';
import { RecurrenciesListItemComponent } from '../components/recurrencies-list-item.component';
import { CommonModule } from '@angular/common';
import { PeriodUnit, toPeriodUnit } from '../types/PeriodUnit';
import { Recurrency } from '../models/Recurrency';

@Component({
  selector: 'app-recurrencies-list',
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonButton, RecurrenciesListItemComponent, CommonModule],
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>RecurrenciesListPage</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content [forceOverscroll]="false">
        <app-recurrencies-list-item
          *ngFor="let recurrency of recurrencies"
          [title]="recurrency.title"
          [lastEvent]="recurrency.lastEvent"
          [periodNb]="recurrency.periodNb"
          [periodUnit]="recurrency.periodUnit"
        ></app-recurrencies-list-item>
    </ion-content>
  `,
  styles: ``,
})
export class RecurrenciesListPage {

  recurrencies: {title: string, lastEvent: string, periodNb: number, periodUnit: PeriodUnit}[] = [
    {title: 'PC-7', lastEvent: '22.08.2024', periodNb: 94, periodUnit: toPeriodUnit('days')},
    {title: 'EC', lastEvent: '22.08.2024', periodNb: 66, periodUnit: toPeriodUnit('days')}
  ]

  constructor() {
    Recurrency.TEST()
  }

}