
import { Component, computed, inject } from "@angular/core";
import { store } from "../recurrencies/services/mock-datas";
import { IonButton, IonContent, IonHeader, IonTitle, IonToolbar } from "@ionic/angular/standalone";
import { RecurrencyService } from "@app/recurrencies/services/recurrency.service";
import { DateString } from "src/js/timezone-date/types/DateString.type";
import { PositiveInteger } from "@app/recurrencies/types/PositiveInteger.type";
import { PeriodUnit } from "src/js/timezone-date/types/PeriodUnit.type";
import { Recurrency } from "@app/recurrencies/types/Recurrency.type";
import { TIMEZONE } from "src/js/timezone-date/types/Timezone";

@Component({
  selector: 'app-testing-page',
  standalone: true,
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButton
  ],
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>
          Testing
        </ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content [forceOverscroll]="false">
      TestingPage works!

      @if (recurrencies().length === 0) {
        <div>no recurrencies found...</div>
      }

      @for (recurrency of recurrencies(); track recurrency.uid) {
        <p>
          {{ recurrency.title }}
          <ion-button size="small" color="danger" (click)="recurrencyService.remove(recurrency.uid)">delete</ion-button>
        </p>
      }

      <ion-button (click)="onAdd()">add</ion-button>
      <ion-button (click)="onSet()">set</ion-button>

    </ion-content>
  `,
  styles: [``]
})
export class TestingPage {
  // DEPENDENCIES
  recurrencyService = inject(RecurrencyService)

  // STATE

  // SELECTORS
  recurrencies = computed(() => this.recurrencyService.recurrencies())

  // ACTIONS
  onAdd = () => this.recurrencyService.add({
    title: 'EC',
    lastEvent: '2026-02-01' as DateString,
    periodNb: 66 as PositiveInteger, 
    periodUnit: 'days' as PeriodUnit,
    category: 'Aircrafts'
  })

  onSet = () => this.recurrencyService.set([
    new Recurrency('adjkal', {
      title: 'EC',
      lastEvent: '2026-02-01' as DateString,
      periodNb: 66 as PositiveInteger, 
      periodUnit: 'days' as PeriodUnit,
      category: 'Aircrafts'
    },
    TIMEZONE.MAURITIUS),
    new Recurrency('hjhisiu', {
      title: 'PU',
      lastEvent: '2026-02-01' as DateString,
      periodNb: 66 as PositiveInteger, 
      periodUnit: 'days' as PeriodUnit,
      category: 'Aircrafts'
    },
    TIMEZONE.MAURITIUS),
    new Recurrency('oiufcsa', {
      title: 'PT',
      lastEvent: '2026-02-01' as DateString,
      periodNb: 66 as PositiveInteger, 
      periodUnit: 'days' as PeriodUnit,
      category: 'Aircrafts'
    },
    TIMEZONE.MAURITIUS)
  ])

  constructor() {
    console.log(this.recurrencies())
  }

  // PRIVATE

}


