import dayjs from "dayjs";
import utc  from "dayjs/plugin/utc";
import timezonePlugin from "dayjs/plugin/timezone";

import { DateString } from "@app/_types/DateString"
import { TimeString } from "@app/_types/TimeString"
import { Timezone } from "@app/_types/Timezone"
import { TimezoneDateInterface } from "../types/TimezoneDateInterface"
import { DateFormat } from "@app/_types/DateFormat";
import { PositiveInteger } from "@app/_types/PositiveInteger";
import { PeriodUnit } from "@app/_types/PeriodUnit";

// ----------  INIT DAYJS  ----------------------
dayjs.extend(utc)
dayjs.extend(timezonePlugin)

const LOCALE = navigator.language
const LOCALE_OPTIONS = {
  weekStart: 1 // Sets the weekstart to Monday
}
dayjs.locale(LOCALE, LOCALE_OPTIONS)
// ----------------------------------------------

export class TimezoneDate implements TimezoneDateInterface {

  readonly dateString
  readonly timeString
  readonly timezone

  private _date: Date
  
  constructor(dateString: DateString, timeString: TimeString, timezone: Timezone) {
    this.dateString = dateString
    this.timeString = timeString
    this.timezone = timezone
    this._date = dayjs.tz(`${this.dateString} ${this.timeString}`, `${this.timezone}`).toDate()
  }

  static now(timezone: Timezone) {
    const nowDayjsDate = dayjs().tz(timezone)
    const newDateString = nowDayjsDate.format('YYYY-MM-DD') as DateString
    const newTimeString = nowDayjsDate.format('HH:mm:ss.SSS') as TimeString

    return new TimezoneDate(newDateString, newTimeString, timezone)
  }

  toString(format: DateFormat) {
    switch(format) {
        case 'CH': {
          return dayjs(this._date).tz(this.timezone).format('DD.MM.YY')
        }
        case 'US': {
          return dayjs(this._date).tz(this.timezone).format('MM/DD/YY')
        }
        case 'ISO': {
          return dayjs(this._date).tz(this.timezone).format('YYYY-MM-DDTHH:mm:ss.SSSZZ')
        }
        case 'PLATFORM_DEFINED': {
          return dayjs(this._date).tz(this.timezone).toDate().toLocaleDateString()
        }
      }
  }

  toDate() {
    return this._date
  }

  add(nb: PositiveInteger, unit: PeriodUnit): TimezoneDateInterface {
    const newDayjsDate = dayjs(this._date).add(nb, unit)
    const newDateString = newDayjsDate.format('YYYY-MM-DD') as DateString
    const newTimeString = newDayjsDate.format('HH:mm:ss.SSS') as TimeString

    return new TimezoneDate(newDateString, newTimeString, this.timezone)
  }
  
  subtract(nb: PositiveInteger, unit: PeriodUnit): TimezoneDateInterface {
    const newDayjsDate = dayjs(this._date).subtract(nb, unit)
    const newDateString = newDayjsDate.format('YYYY-MM-DD') as DateString
    const newTimeString = newDayjsDate.format('HH:mm:ss.SSS') as TimeString

    return new TimezoneDate(newDateString, newTimeString, this.timezone)
  }
  
  diff(unit: PeriodUnit, date2: TimezoneDateInterface = TimezoneDate.now(this.timezone)): number {
    // Takes the floor of decimal values. Eg: 1.1 returns 1, as well as 1.9 returns 1!!!
    return dayjs(this.toDate()).diff(date2.toDate(), unit)
  }

}