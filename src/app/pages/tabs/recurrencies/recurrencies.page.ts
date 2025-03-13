import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';

import { RecurrencyListItemComponent } from './recurrency-list-item/recurrency-list-item.component';
import { RecurrencyService } from '@shared/services/recurrency.service';

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
      <ng-container *ngFor="let recurrency of (recurrencies$ | async)">
        <app-recurrency-list-item
          [recurrency]="recurrency"
        ></app-recurrency-list-item>
      </ng-container>
    </ion-content>
  `,
  styles: ``,
})
export class TabsRecurrenciesPage {

  recurrencies$ = this.recurrencyService.recurrencies$$
  // .pipe(
  //   map(recs => recs.sort((a,b) => progress(a) - progress(b)))
  // )

  constructor(private recurrencyService: RecurrencyService) {}

  ngOnDestroy() {
    console.log('TabsRecurrenciesPage destroyed')
  }
} 