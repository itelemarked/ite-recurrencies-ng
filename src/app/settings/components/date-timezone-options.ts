import { Component, computed, model } from "@angular/core";
import { IonicModule } from '@ionic/angular';

import { SharedModule } from "../../_shared/_shared-module";
import { TimezoneDate } from "../../../js/timezone-date/TimezoneDate";
import { Timezone } from "../../../js/timezone-date/types/Timezone";

@Component({
  selector: 'app-date-timezone-options',
  imports: [
    IonicModule,
    SharedModule,
  ],
  template: `
    <!-- <app-input-select
      label="Timezone"
      [options]="timezoneOptions()"
      [(value)]="value"
    /> -->
  `,
  styles: [``]
})
export class DateTimezoneOptions {

  value = model<Timezone | undefined>()

  protected timezoneOptions = computed(() => {
    const timezones: Timezone[] = ['Europe/Zurich', 'Indian/Mauritius', 'UTC', 'platform-defined']
    return timezones.map(timezone => ({ 
      value: timezone, 
      text: timezone ===  'platform-defined' ? timezone + ' (' + TimezoneDate.getPlatformTimezone() + ')' : timezone
    }))
  })
}