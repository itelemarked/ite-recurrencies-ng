import { Component, computed, input } from "@angular/core";
import { IonicModule } from '@ionic/angular';

import { SharedModule } from "../../_shared/_shared-module";
import { DateFormat } from "../../../js/timezone-date/types/DateFormat";
import { Timezone } from "../../../js/timezone-date/types/Timezone";
import { TimezoneDate } from "../../../js/timezone-date/TimezoneDate";
import { DateString } from "../../../js/timezone-date/types/DateString";
import { TimeString } from "../../../js/timezone-date/types/TimeString";

@Component({
  selector: 'app-date-settings',
  imports: [
    IonicModule,
    SharedModule
  ],
  template: `
    <app-list>
      <ion-header>Date</ion-header>
      <ion-item button>
        <ion-label>Format</ion-label>
        <ion-note>{{ dateFormatString() }}</ion-note>
      </ion-item>
      <ion-item button>
        <ion-label>Timezone</ion-label>
        <ion-note>{{ timezone() }}</ion-note>
      </ion-item>
    </app-list>
  `,
  styles: [``]
})
export class DateSettings {
  dateFormat = input.required<DateFormat>()
  timezone = input.required<Timezone>()

  protected dateFormatString = computed(() => {
    const date = TimezoneDate.create('2026-03-20' as DateString, '12:30' as TimeString, 'UTC', 'ISO')
    const dateFormat = this.dateFormat()
    return date.toString({dateFormat})
  })
}