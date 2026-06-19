import { Component, computed, model } from "@angular/core";
import { IonicModule } from '@ionic/angular';

import { SharedModule } from "../../_shared/_shared-module";
import { AppInputSelect } from "../../_shared/app-input-select";
import { TimezoneDate } from "../../../js/timezone-date/TimezoneDate";
import { DateString } from "../../../js/timezone-date/types/DateString";
import { TimeString } from "../../../js/timezone-date/types/TimeString";
import { DateFormat } from "../../../js/timezone-date/types/DateFormat";

@Component({
  selector: 'app-date-format-options',
  imports: [
    IonicModule,
    SharedModule,
    AppInputSelect
  ],
  template: `
    <app-input-select
      label="Date Format"
      [options]="dateFormatOptions()"
      [(value)]="value"
    ></app-input-select>
  `,
  styles: [``]
})
export class DateFormatOptions {

  value = model<DateFormat | undefined>()

  protected dateFormatOptions = computed(() => {
    const date = TimezoneDate.create('2026-03-20' as DateString, '12:30' as TimeString, 'UTC', 'ISO')
    const dateFormats: DateFormat[] = ['CH_DATE', 'CH_DATE_TIME', 'DATE_STRING', 'ISO', 'PLATFORM_DEFINED', 'US_DATE']
    return dateFormats.map(dateFormat => ({value: dateFormat, text: date.toString({dateFormat})}))
  })
}