import { Component } from '@angular/core';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';

import { RecurrencyListItemComponent } from '../components/recurrency-list-item.component';
import { RecurrencyService } from '../services/recurrency.service';

@Component({
  selector: 'app-recurrency-list',
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

    <ion-content>
      <ng-container *ngFor="let recurrency of (recurrencies$ | async)">
        <app-recurrency-list-item
          [recurrency]="recurrency"
        ></app-recurrency-list-item>
      </ng-container>
    </ion-content>
  `,
  styles: ``,
})
export class RecurrencyListPage {

  recurrencies$ = this.recurrencyService.recurrencies$$
  // .pipe(
  //   map(recs => recs.sort((a,b) => progress(a) - progress(b)))
  // )

  constructor(private recurrencyService: RecurrencyService) {
    
  }
} 