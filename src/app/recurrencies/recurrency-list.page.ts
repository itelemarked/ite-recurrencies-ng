import { Component, computed, inject, Signal } from '@angular/core';
import {
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonItemOption,
  IonItemOptions,
  IonItemSliding,
  IonLabel,
  IonNote,
  IonList,
  IonListHeader,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';
import { isRecurrency, Recurrency } from './types/Recurrency.type';
import { getPlatformTimezone } from './utils/date';
import { PositiveInteger } from './types/PositiveInteger.type';
import { DateString } from './types/DateString.type';
import { RecurrencyListItemComponent } from './components/recurrency-list-item.component';
import { RecurrencyMockService } from './services/recurrency-mock.service';

@Component({
  selector: 'app-recurrency-list',
  standalone: true,
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonList,
    IonListHeader,
    RecurrencyListItemComponent,

    IonIcon,
    IonItem,
    IonItemOption,
    IonItemOptions,
    IonItemSliding,
    IonLabel,
    IonNote,
  ],
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title> RecurrencyList </ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content [forceOverscroll]="false">
      <ng-container *ngFor="let grouped of recurrenciesGroupedByCategory()">
        <ion-list [inset]="true">
          <ion-list-header>
            <ion-label>{{ grouped[0] }}</ion-label>
          </ion-list-header>
          <ng-container *ngFor="let recurrency of grouped[1]">
            <recurrency-list-item [recurrency]="recurrency" />
          </ng-container>
        </ion-list>
      </ng-container>
    </ion-content>
  `,
  styles: [``],
})
export class RecurrencyListPage {
  private recurrencyService = inject(RecurrencyMockService);

  recurrencies = this.recurrencyService.recurrencies;

  groupBy<T extends Record<string, unknown>>(items: T[], fn: (item: T) => string): [string, T[]][] {
    let result: any = {};
    items.forEach((item) => {
      if (result[fn(item)] === undefined) {
        result[fn(item)] = [];
        result[fn(item)].push(item);
      } else {
        result[fn(item)].push(item);
      }
    });
    return Object.entries(result);
  }

  recurrenciesGroupedByCategory: Signal<any> = computed(() => {
    return this.groupBy(this.recurrencies(), ({category}) => category)
  });

  constructor() {
    
    this.recurrencyService.recurrencies$().subscribe((res) => {
      console.log(this.groupBy(this.recurrencies(), ({category}) => category));
    });
  }
}
