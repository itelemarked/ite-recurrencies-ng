import { Component, computed, inject } from "@angular/core";

import { IonicModule } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { ellipsisHorizontalOutline } from 'ionicons/icons';

import { DateString } from "../../js/timezone-date/types/DateString";
import { PeriodUnit } from "../../js/timezone-date/types/PeriodUnit";

import { SettingsService } from "../settings/services/settings-service";
import { RecurrencyService } from "./services/recurrency-service";
import { PositiveInteger } from "../../js/timezone-date/types/PositiveInteger";

@Component({
  selector: 'app-recurrencies-page',
  imports: [
    IonicModule,
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

      <!-- <app-recurrency-list
        [recurrencies]="recurrencies()"
        [timezone]="timezone()"
        [dateFormat]="dateFormat()"
        (edit)="onEdit($event)"
      /> -->

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
  private recurrencyService = inject(RecurrencyService)

  // STATE

  // SELECTORS
  protected timezone = computed(() => this.settingsService.settings().timezone)
  protected dateFormat = computed(() => this.settingsService.settings().dateFormat)

  // ACTIONS
  constructor() {
    addIcons({ ellipsisHorizontalOutline });
  }

  onEdit(uid: string) {
    console.log('tapped')
  }

  onOpenActionSheet = () => {
    // TODO
  }

  // PRIVATE

}