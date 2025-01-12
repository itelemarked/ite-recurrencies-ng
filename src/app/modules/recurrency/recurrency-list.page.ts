import { Component } from '@angular/core';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { RecurrencyListItemComponent } from './recurrency-list-item.component';
import { RecurrencyService } from './recurrency.service';
import { CommonModule } from '@angular/common';

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
export class ListPage {

  recurrencies$ = this.recurrencyService.getAll$()
  // .pipe(
  //   map(recs => recs.sort((a,b) => progress(a) - progress(b)))
  // )

  constructor(private recurrencyService: RecurrencyService) {}
} 