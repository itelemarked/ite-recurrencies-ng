import dayjs, { ManipulateType } from "dayjs";
import utc  from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

import { DateString } from "./types/DateString";
import { TimeString } from "./types/TimeString";
import { Timezone } from "./types/Timezone";
import { DateFormat } from "./types/DateFormat";
import { PeriodUnit } from "./types/PeriodUnit";
import { TimezoneDateInterface } from "./types/TimezoneDateInterface";
import { PositiveInteger } from "./types/PositiveInteger";


// FACADE FOR DATE UTILITY FUNCTIONS
const D = (function() {
  // ----------  INIT DAYJS  ----------------------
  dayjs.extend(utc)
  dayjs.extend(timezone)

  const LOCALE = navigator.language
  const LOCALE_OPTIONS = {
    weekStart: 1 // Sets the weekstart to Monday
  }
  dayjs.locale(LOCALE, LOCALE_OPTIONS)
  // ----------------------------------------------

  const DAYJS = dayjs

  function getDateString(date: Date, timezone: Timezone) {
    return DAYJS(date).tz(timezone).format('YYYY-MM-DD') as DateString
  }

  function getTimeString(date: Date, timezone: Timezone) {
    return DAYJS(date).tz(timezone).format('HH:mm:ss.SSS') as TimeString
  }

  function getDate(dateString: DateString, timeString: TimeString, timezone: Timezone) {
    return DAYJS(`${dateString}T${timeString}`).tz(timezone, true).toDate()
  }

  function format(date: Date, timezone: Timezone, dateFormat: DateFormat) {
    const convert: Record<DateFormat, string> = {
      PLATFORM_DEFINED: DAYJS(date).tz(timezone).toDate().toLocaleDateString(),
      CH_DATE: DAYJS(date).tz(timezone).format('DD.MM.YYYY'),
      CH_DATE_TIME: DAYJS(date).tz(timezone).format('DD.MM.YYYY HH:mm'),
      US_DATE: DAYJS(date).tz(timezone).format('MM/DD/YY'),
      ISO: DAYJS(date).tz(timezone).format('YYYY-MM-DDTHH:mm:ss.SSSZ'), 
      DATE_STRING: DAYJS(date).tz(timezone).format('YYYY-MM-DD'),
    }
    return convert[dateFormat]
  }

  function diff(date1: Date, date2: Date, unit: PeriodUnit, floored: boolean) {
    const dayjsUnit = _toDayJsUnit(unit)
    return DAYJS(date1).diff(date2, dayjsUnit, !floored)
  }

  function add(date: Date, nb: PositiveInteger, unit: PeriodUnit, timezone: Timezone) {
    const dayjsUnit = _toDayJsUnit(unit)
    return DAYJS(date).tz(timezone).add(nb, dayjsUnit).toDate()
  }

  function subtract(date: Date, nb: PositiveInteger, unit: PeriodUnit, timezone: Timezone) {
    const dayjsUnit = _toDayJsUnit(unit)
    return DAYJS(date).tz(timezone).subtract(nb, dayjsUnit).toDate()
  }

  function endOf(date: Date, unit: PeriodUnit, timezone: Timezone) {
    const dayjsUnit = _toDayJsUnit(unit)
    return DAYJS(date).tz(timezone).endOf(dayjsUnit).toDate()
  }

  // NOT NEEDED??? TO DELETE?
  function getPlatformTimezone() {
    return DAYJS.tz.guess()
  }

  function _toDayJsUnit(unit: PeriodUnit): ManipulateType {
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

  return {
    getDateString,
    getTimeString,
    getDate,
    format,
    diff,
    add,
    subtract,
    endOf
  }

}())




export const isTimezoneDate = (val: any): val is TimezoneDate => val instanceof TimezoneDate

interface TimezoneDateState {
  date: Date,
  timezone: Timezone,
  dateFormat: DateFormat
}

export class TimezoneDate implements TimezoneDateInterface {
// export class TimezoneDate  {

  // STATE
  private state: TimezoneDateState

  static createByDate = (date: Date, timezone: Timezone, dateFormat: DateFormat) => new TimezoneDate(date, timezone, dateFormat)

  static create = (dateString: DateString, timeString: TimeString, timezone: Timezone, dateFormat: DateFormat) => {
    const date = D.getDate(dateString, timeString, timezone)
    return new TimezoneDate(date, timezone, dateFormat)
  }
  

  constructor(date: Date, timezone: Timezone, dateFormat: DateFormat) {
    if(date.toString() === 'Invalid Date') throw new Error(`Invalid date in constructor argument`)
    this.state = {
      date,
      timezone,
      dateFormat
    }
  }

  dateString = (
    {timezone = this.state.timezone}
    : {timezone?: Timezone}
    = {} 
  ) => D.getDateString(this.state.date, timezone)

  timeString = (
    {timezone = this.state.timezone}
    : {timezone?: Timezone}
    = {} 
  ) => D.getTimeString(this.state.date, timezone)
  
  timezone = () => this.state.timezone

  dateFormat = () => this.state.dateFormat

  date = () => this.state.date

  diff = (unit: PeriodUnit, {
    // timezoneDate = TimezoneDate.createByDate(new Date(), this.state.timezone, this.state.dateFormat), 
    timezoneDate,
    floored = true
  }: {
    timezoneDate?: TimezoneDateInterface, 
    floored?: boolean
  } = {}) => {
    const dateOrNow = timezoneDate?.date() ?? new Date()
    return D.diff(this.state.date, dateOrNow, unit, floored)
  }

  /**
   * returns a string, formatted with dateFormat and timezone
   * If not explicitly defined, the timezone and dateFormat are the default ones, defined upon TimezoneDate creation.
   * If timezone is defined, it will return the local date and time respective to the defined timezone.
   * It only displays the date, it doesn't mutate it.
   * 
   * @example
   * timezone: 'Indian/Mauritius' (which has an offset of +04:00)
   * date: 10.3.2026, local time (in Mauritius): 1300h
   * The ISO format returns: '2026-03-10T13:00:00.000+04:00'
   * The CH_DATE_TIME format returns '10.03.2026 13:00' (local date and time to the Mauritius)
   */
  toString = ({
    timezone = this.state.timezone,
    dateFormat = this.state.dateFormat
  }: {
    timezone?: Timezone,
    dateFormat?: DateFormat
  } = {}) => D.format(this.state.date, timezone, dateFormat)
  
  update = ({
    dateString = D.getDateString(this.state.date, this.state.timezone),
    timeString = D.getTimeString(this.state.date, this.state.timezone),
    timezone = this.state.timezone,
    dateFormat = this.state.dateFormat
  }: {
    dateString?: DateString, 
    timeString?: TimeString, 
    timezone?: Timezone, 
    dateFormat?: DateFormat
  }) => {
    return new TimezoneDate(D.getDate(dateString, timeString, timezone), timezone, dateFormat)
  }

  add = (nb: PositiveInteger, unit: PeriodUnit, {
    timezone = this.state.timezone,
    dateFormat = this.state.dateFormat
  }: {
    timezone?: Timezone,
    dateFormat?: DateFormat
  } = {}) => {
    const newDate = D.add(this.state.date, nb, unit, timezone)
    return new TimezoneDate(newDate, timezone, dateFormat)
  }

  subtract = (nb: PositiveInteger, unit: PeriodUnit, {
    timezone = this.state.timezone,
    dateFormat = this.state.dateFormat
  }: {
    timezone?: Timezone,
    dateFormat?: DateFormat
  } = {}) => {
    const newDate = D.subtract(this.state.date, nb, unit, timezone)
    return new TimezoneDate(newDate, timezone, dateFormat)
  }

  endOf = (unit: PeriodUnit, {
    timezone = this.state.timezone,
    dateFormat = this.state.dateFormat
  }: {
    timezone?: Timezone,
    dateFormat?: DateFormat
  } = {}) => {
    const newDate = D.endOf(this.state.date, unit, timezone)
    return new TimezoneDate(newDate, timezone, dateFormat)
  }
  
}