import dayjs, { ManipulateType } from "dayjs";
import utc  from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

import { DateString } from "./types/DateString";
import { TimeString } from "./types/TimeString";
import { Timezone } from "./types/Timezone";

import { DATE_FORMAT, DateFormat } from "./types/DateFormat";

import { PeriodUnit } from "./types/PeriodUnit";
import { PositiveInteger } from "../types/PositiveInteger.type";



// ----------  INIT DAYJS  ----------------------
dayjs.extend(utc)
dayjs.extend(timezone)

const LOCALE = navigator.language
const LOCALE_OPTIONS = {
  weekStart: 1 // Sets the weekstart to Monday
}
dayjs.locale(LOCALE, LOCALE_OPTIONS)
// ----------------------------------------------


export const isTimezoneDate9 = (val: any): val is TimezoneDate9 => val instanceof TimezoneDate9


export class TimezoneDate9 {

  private _dateString: DateString
  private _timeString: TimeString
  private _timezone: Timezone
  private _date: Date

  /** STATIC UTIL METHOD */
  static getPlatformTimezone() {
    return dayjs.tz.guess()
  }

  /** STATIC CONSTRUCTOR */
  /** 'dateString' and 'timeString' are locale defined in the given 'timezone' */
  static create(dateString: DateString, timeString: TimeString, timezone: Timezone) {
    return new TimezoneDate9(dateString, timeString, timezone)
  }

  /** STATIC CONSTRUCTOR */
  /** 
   * 'timezone' here is independent of 'date' argument (the only purpose of 'timezone' parameter is to set the instance 'timezone' property)
   * Be aware of the native Date constructor, which in some cases uses the platform timezone!!
   * E.g: considering the platform timezone is 'Europe/Zurich', new Date('2026-02-01T12:00') --> '2026-02-01T11:00:00.000Z'!
   */
  static createFromDate(date: Date, timezone: Timezone) {
    const dateString = dayjs(date).tz(timezone).format('YYYY-MM-DD') as DateString
    const timeString = dayjs(date).tz(timezone).format('HH:mm:ss.SSS') as TimeString
    return new TimezoneDate9(dateString, timeString, timezone)
  }

  /** STATIC CONSTRUCTOR */
  /** 
   * the only purpose of 'timezone' parameter is to set the 'timezone' property
   */
  static now(timezone: Timezone): TimezoneDate9 {
    const date = new Date()
    const dateString = dayjs(date).tz(timezone).format('YYYY-MM-DD') as DateString
    const timeString = dayjs(date).tz(timezone).format('HH:mm:ss.SSS') as TimeString
    return new TimezoneDate9(dateString, timeString, timezone)
  }

  /** PRIVATE CONSTRUCTOR. USE STATIC CONSTRUCTORS TO INSTANCIATE! */
  private constructor(dateString: DateString, timeString: TimeString, timezone: Timezone) {
    this._dateString = dateString
    this._timeString = timeString
    this._timezone = timezone
    this._date = dayjs(`${dateString}T${timeString}`).tz(timezone, true).toDate()
  }

  getDateString(): DateString {
    return this._dateString
  }

  getTimeString(): TimeString {
    return this._timeString
  }

  getTimezone(): Timezone {
    return this._timezone
  }

  toDate(): Date {
    return this._date
  }

  format(dateFormat: DateFormat): string {
    const convert: Record<DateFormat, string> = {
      PLATFORM_DEFINED: dayjs(this._date).tz(this._timezone).toDate().toLocaleDateString(),
      CH_DATE: dayjs(this._date).tz(this._timezone).format('DD.MM.YYYY'),
      CH_DATE_TIME: dayjs(this._date).tz(this._timezone).format('DD.MM.YYYY HH:mm:ss.SSS'),
      US_DATE: dayjs(this._date).tz(this._timezone).format('MM/DD/YY'),
      ISO: dayjs(this._date).utc().format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'), // same as Date.toISOString(): in UTC (with 'Z' on the end) and millieconds precision format.
      DATE_STRING: dayjs(this._date).tz(this._timezone).format('YYYY-MM-DD'),
    }
    return convert[dateFormat]
  }

  diff(timezoneDate: TimezoneDate9, unit: PeriodUnit, {floored}: {floored: boolean} = {floored: true}): number {
    const dayjsUnit = this._toDayjsManipulatedType(unit)
    return dayjs(this._date).diff(timezoneDate.toDate(), dayjsUnit, !floored)
  }

  diffToNow(unit: PeriodUnit, {floored}: {floored: boolean} = {floored: true}): number {
    const dayjsUnit = this._toDayjsManipulatedType(unit)
    return dayjs(this._date).diff(new Date(), dayjsUnit, !floored)
  }

  add(nb: PositiveInteger, unit: PeriodUnit): TimezoneDate9 {
    const dayjsUnit = this._toDayjsManipulatedType(unit)
    const newDate = dayjs(this._date).add(nb, dayjsUnit).toDate()
    const newDateString = this._getDateStringFromDate(newDate)
    const newTimeString = this._getTimeStringFromDate(newDate)
    return new TimezoneDate9(newDateString, newTimeString, this._timezone)
  }

  subtract(nb: PositiveInteger, unit: PeriodUnit): TimezoneDate9 {
    const dayjsUnit = this._toDayjsManipulatedType(unit)
    const newDate = dayjs(this._date).subtract(nb, dayjsUnit).toDate()
    const newDateString = this._getDateStringFromDate(newDate)
    const newTimeString = this._getTimeStringFromDate(newDate)
    return new TimezoneDate9(newDateString, newTimeString, this._timezone)
  }

  endOf(unit: PeriodUnit): TimezoneDate9 {
    const dayjsUnit = this._toDayjsManipulatedType(unit)
    const newDate = dayjs(this._date).tz(this._timezone).endOf(dayjsUnit).toDate()
    const newDateString = this._getDateStringFromDate(newDate)
    const newTimeString = this._getTimeStringFromDate(newDate)
    return new TimezoneDate9(newDateString, newTimeString, this._timezone)
  }

  private _toDayjsManipulatedType(unit: PeriodUnit): ManipulateType {
    const convert: Record<PeriodUnit, ManipulateType> = {
      milliseconds: 'milliseconds',
      seconds: 'seconds',
      minutes: 'minutes',
      hours: 'hours',
      days: 'days',
      weeks: 'weeks',
      months: 'months',
      years: 'years'
    }
    return convert[unit]
  }

  private _getDateStringFromDate(date: Date): DateString {
    return dayjs(date).tz(this._timezone).format('YYYY-MM-DD') as DateString
  }

  private _getTimeStringFromDate(date: Date): TimeString {
    return dayjs(date).tz(this._timezone).format('HH:mm:ss.SSS') as TimeString
  }

}

