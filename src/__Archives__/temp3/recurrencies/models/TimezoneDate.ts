import dayjs from "dayjs";
import utc  from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { DateString } from "../types/DateString";
import { TimeString } from "../types/TimeString";
import { Timezone } from "../types/Timezone";
import { PositiveInteger } from "../types/PosititveInteger";
import { PeriodUnit } from "../types/PeriodUnit";
import { DateFormat } from "../types/DateFormat";


export class TimezoneDate {

  private _dateString: DateString
  private _timeString: TimeString
  private _timezone: Timezone
  private _date: Date

  constructor(dateString: DateString, timeString: TimeString, timezone: Timezone) {
    this._initDayJs()

    this._dateString = dateString
    this._timeString = timeString
    this._timezone = timezone
    this._date = dayjs(`${dateString}T${timeString}`).tz(timezone, true).toDate()
  }

  private _initDayJs() {
    dayjs.extend(utc)
    dayjs.extend(timezone)

    const LOCALE = navigator.language
    const LOCALE_OPTIONS = {
      weekStart: 1 // Sets the weekstart to Monday
    }
    dayjs.locale(LOCALE, LOCALE_OPTIONS)
  }

  getDateString() {
    return this._dateString
  }

  getTimeString() {
    return this._timeString
  }

  getTimezone() {
    return this._timezone
  }

  getDate() {
    return this._date
  }

  add(nb: PositiveInteger, unit: PeriodUnit) {
    const newDate = dayjs(this._date).add(nb, unit).toDate()
    const dateString = dayjs(newDate).tz(this._timezone).format('YYYY-MM-DD') as DateString
    const timeString = dayjs(newDate).tz(this._timezone).format('HH:mm:ss.SSS') as TimeString
    return new TimezoneDate(dateString, timeString, this._timezone)
  }

  subtract(nb: PositiveInteger, unit: PeriodUnit) {
    const newDate = dayjs(this._date).subtract(nb, unit).toDate()
    const dateString = dayjs(newDate).tz(this._timezone).format('YYYY-MM-DD') as DateString
    const timeString = dayjs(newDate).tz(this._timezone).format('HH:mm:ss.SSS') as TimeString
    return new TimezoneDate(dateString, timeString, this._timezone)
  }

  endOf(unit: PeriodUnit) {
    // make sure dayjs is configurated to have week start setted to Monday!
    const newDate = dayjs(this._date).tz(this._timezone).endOf(unit).toDate()
    const dateString = dayjs(newDate).tz(this._timezone).format('YYYY-MM-DD') as DateString
    const timeString = dayjs(newDate).tz(this._timezone).format('HH:mm:ss.SSS') as TimeString
    return new TimezoneDate(dateString, timeString, this._timezone)
  }

  diffFromNow(unit: PeriodUnit) {
    // returns an integer as a floor (e.g: 1.1 returns 1, 1.9 returns 1, -1.9 returns 1, etc...)
    // returns a positive number if the TimezoneDate is in the future, and a negative number if in the past.
    const date1 = this._date
    const date2 = new Date()
    return dayjs(date1).diff(date2, unit)
  }

  format(format: DateFormat) {
    switch(format) {
      case 'CH': {
        return dayjs(this._date).tz(this._timezone).format('DD.MM.YY')
      }
      case 'US': {
        return dayjs(this._date).tz(this._timezone).format('MM/DD/YY')
      }
      case 'ISO': {
        return dayjs(this._date).tz(this._timezone).format('YYYY-MM-DDTHH:mm:ss.SSSZZ')
      }
      case 'PLATFORM_DEFINED': {
        return dayjs(this._date).tz(this._timezone).toDate().toLocaleDateString()
      }
    }
  }

}

