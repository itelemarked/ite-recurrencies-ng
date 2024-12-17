import { Component } from '@angular/core';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { RecurrencyListItemComponent } from './list-item.component';
import { Recurrency, toRecurrency } from './interfaces/Recurrency';
import { addDay, tzDate } from '@formkit/tempo';
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
      <p>Recurrencies List Page works!</p>
      <ng-container *ngFor="let recurrency of recurrencies">
        <app-recurrency-list-item
          [recurrency]="recurrency"
        ></app-recurrency-list-item>
      </ng-container>
    </ion-content>
  `,
  styles: ``,
})
export class ListPage {

  recurrencies!: Recurrency[]

  constructor(private recurrencyService: RecurrencyService) {
    this.recurrencyService.getAll$().subscribe(r => this.recurrencies = r)
  }

} 