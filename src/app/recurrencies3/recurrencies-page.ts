import { Component, computed, inject } from "@angular/core";

import { IonicModule } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { ellipsisHorizontalOutline } from 'ionicons/icons';

import { RecurrencyList } from "./components/recurrency-list";

import { DateString } from "../../js/timezone-date/types/DateString.type";
import { PeriodUnit } from "../../js/timezone-date/types/PeriodUnit.type";
import { PositiveInteger } from "../recurrencies/types/PositiveInteger.type";
import { SettingsService } from "./services/settings-service";

@Component({
  selector: 'app-recurrencies-page',
  imports: [
    IonicModule,
    RecurrencyList
],
  template: `
    <ion-header collapse="fade" [translucent]="true">
      <ion-toolbar>
        <ion-title>Recurrencies</ion-title>
        <ion-buttons slot="end">
          <ion-button (click)="onOpenActionSheet()">
            <ion-icon slot="icon-only" name="ellipsis-horizontal-outline"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content [forceOverscroll]="false">

      <app-recurrency-list
        [recurrencies]="recurrencies()"
        [timezone]="timezone()"
        [dateFormat]="dateFormat()"
      />

    </ion-content>
  `,
  styles: [``]
})
export class RecurrenciesPage {
  recurrencies = computed(() => ([
    {uid: 'adjklas', title: 'abcd', lastEvent: '2026-01-01' as DateString, periodNb: 2 as PositiveInteger, periodUnit: 'days' as PeriodUnit, category: 'Aircraft'},
    {uid: 'uiojalés', title: 'abcd', lastEvent: '2026-01-01' as DateString, periodNb: 2 as PositiveInteger, periodUnit: 'days' as PeriodUnit, category: 'Aircraft'}
  ]))

  // DEPENDENCIES
  private settingsService = inject(SettingsService)

  // STATE

  // SELECTORS
  protected timezone = computed(() => this.settingsService.settings().timezone)
  protected dateFormat = computed(() => this.settingsService.settings().dateFormat)

  // ACTIONS
  constructor() {
    addIcons({ ellipsisHorizontalOutline });
  }

  onOpenActionSheet = () => {
    // TODO
  }

  // PRIVATE

}