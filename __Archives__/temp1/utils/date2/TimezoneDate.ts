import { DateString, toDateString } from "../../types/DateString";
import { TimeString, toTimeString } from "../../types/TimeString";
import { TimezoneString } from "../../types/TimezoneString";

import dayjs, { ManipulateType, Dayjs, OpUnitType } from "dayjs";
import utc  from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { Integer } from "../../types/Integer";
import { PeriodUnit } from "../../types/PeriodUnit";


// interface ITimezoneDate {
//   // add(nb: Integer, unit: PeriodUnit): ITimezoneDate,
//   // endOf: (unit: PeriodUnit) => ITimezoneDate,
//   // toString: (format: DateFormatOptions) => string
// }

type DateTimeFormatOptions = 
  | 'YYYY-MM-DD'
  | 'DD.MM.YYYY'
  | 'DD.MM.YY'
  | 'YYYY-MM-DD[T]HH:mm:ss.SSSZZ'

type ToStringOptions = {
  format?: DateTimeFormatOptions,
  timezone?: TimezoneString,
  showTimezone?: boolean
}



// ----------  DEPENDENCY: DAYJS  ----------------------
dayjs.extend(utc)
dayjs.extend(timezone)

const LOCALE = navigator.language
const LOCALE_OPTIONS = {
  weekStart: 1 // Sets the weekstart to Monday
}
dayjs.locale(LOCALE, LOCALE_OPTIONS)
// ----------------------------------------------



function convertToManipulateType(unit: PeriodUnit): ManipulateType {
  switch(unit) {
    case 'milliseconds': return 'millisecond'
    case 'seconds': return 'second'
    case 'minutes': return 'minute'
    case 'hours': return 'hour'
    case 'days': return 'day'
    // TODO: check if week is a manipulated type... according definition it is not!!! --> check is positive, 'weeks' is working (strange!)
    case 'weeks': return 'week'
    case 'months': return 'month'
    case 'years': return 'year'
  }
}

function convertToOpUnitType(unit: PeriodUnit): OpUnitType {
  switch(unit) {
    case 'milliseconds': return 'millisecond'
    case 'seconds': return 'second'
    case 'minutes': return 'minute'
    case 'hours': return 'hour'
    case 'days': return 'day'
    case 'weeks': return 'week'
    case 'months': return 'month'
    case 'years': return 'year'
  }
}

function convertToDateString(date: Dayjs): DateString {
  return toDateString(date.format('YYYY-MM-DD'))
}

function convertToTimeString(date: Dayjs): TimeString {
  return toTimeString(date.format('HH:mm:ss.SSS'))
}

function convertToDayjsFormat(format: DateTimeFormatOptions): string {
  switch(format) {
    case 'DD.MM.YY': return 'DD.MM.YY'
    case 'DD.MM.YYYY': return 'DD.MM.YYYY'
    case 'YYYY-MM-DD': return 'YYYY-MM-DD'
    case 'YYYY-MM-DD[T]HH:mm:ss.SSSZZ': return 'YYYY-MM-DD[T]HH:mm:ss.SSSZZ'
  }
}




export class TimezoneDate {

  /** PROPS */
  private _dateString: DateString
  private _timeString: TimeString
  private _timezoneString: TimezoneString

  private _dayjsDate: Dayjs

  constructor(dateString: DateString, timeString: TimeString, timezoneString: TimezoneString) {
    this._dateString = dateString
    this._timeString = timeString
    this._timezoneString = timezoneString
    this._dayjsDate = dayjs.tz(`${this._dateString}T${this._timeString}`, this._timezoneString)
  }

  add(nb: Integer, unit: PeriodUnit): TimezoneDate {
    const newDayjsDate = this._dayjsDate.add(nb, convertToManipulateType(unit))
    const newDateString = convertToDateString(newDayjsDate)
    const newTimeString = convertToTimeString(newDayjsDate)
    return new TimezoneDate(newDateString, newTimeString, this._timezoneString)
  }

  endOf(unit: PeriodUnit): TimezoneDate {
    const newDayjsDate = this._dayjsDate.endOf(convertToOpUnitType(unit))
    const newDateString = convertToDateString(newDayjsDate)
    const newTimeString = convertToTimeString(newDayjsDate)
    return new TimezoneDate(newDateString, newTimeString, this._timezoneString)
  }

  toString({format = 'YYYY-MM-DD[T]HH:mm:ss.SSSZZ', timezone = this._timezoneString, showTimezone = false}: ToStringOptions = {}): string {
    const dateTime = this._dayjsDate.tz(timezone).format(convertToDayjsFormat(format))
    return showTimezone ? dateTime + ', ' + timezone : dateTime
  }

}



