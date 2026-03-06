import dayjs, { ManipulateType } from "dayjs";
import utc  from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

import { DateString } from "./types/DateString";
import { TimeString } from "./types/TimeString";
import { Timezone } from "./types/Timezone";

import { DATE_FORMAT, DateFormat } from "./types/DateFormat";

import { PeriodUnit } from "./types/PeriodUnit";
import { PositiveInteger } from "../../app/recurrencies/types/PositiveInteger.type";



// ----------  INIT DAYJS  ----------------------
dayjs.extend(utc)
dayjs.extend(timezone)

const LOCALE = navigator.language
const LOCALE_OPTIONS = {
  weekStart: 1 // Sets the weekstart to Monday
}
dayjs.locale(LOCALE, LOCALE_OPTIONS)
// ----------------------------------------------


export const isTimezoneDate = (val: any): val is TimezoneDate => val instanceof TimezoneDate


export class TimezoneDate {

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
    return new TimezoneDate(dateString, timeString, timezone)
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
    return new TimezoneDate(dateString, timeString, timezone)
  }

  /** STATIC CONSTRUCTOR */
  /** 
   * the only purpose of 'timezone' parameter is to set the 'timezone' property
   */
  static now(timezone: Timezone): TimezoneDate {
    const date = new Date()
    const dateString = dayjs(date).tz(timezone).format('YYYY-MM-DD') as DateString
    const timeString = dayjs(date).tz(timezone).format('HH:mm:ss.SSS') as TimeString
    return new TimezoneDate(dateString, timeString, timezone)
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
      CH: dayjs(this._date).tz(this._timezone).format('DD.MM.YYYY'),
      US: dayjs(this._date).tz(this._timezone).format('MM/DD/YY'),
      ISO: dayjs(this._date).utc().format('YYYY-MM-DDTHH:mm:ss.SSS[Z]'), // same as Date.toISOString(): in UTC (with 'Z' on the end) and millieconds precision format.
      DATE_STRING: dayjs(this._date).tz(this._timezone).format('YYYY-MM-DD'),
    }
    return convert[dateFormat]
  }

  diff(timezoneDate: TimezoneDate, unit: PeriodUnit, {floored}: {floored: boolean} = {floored: true}): number {
    const dayjsUnit = this._toDayjsManipulatedType(unit)
    return dayjs(this._date).diff(timezoneDate.toDate(), dayjsUnit, !floored)
  }

  diffToNow(unit: PeriodUnit, {floored}: {floored: boolean} = {floored: true}): number {
    const dayjsUnit = this._toDayjsManipulatedType(unit)
    return dayjs(this._date).diff(new Date(), dayjsUnit, !floored)
  }

  add(nb: PositiveInteger, unit: PeriodUnit): TimezoneDate {
    const dayjsUnit = this._toDayjsManipulatedType(unit)
    const newDate = dayjs(this._date).add(nb, dayjsUnit).toDate()
    const newDateString = this._getDateStringFromDate(newDate)
    const newTimeString = this._getTimeStringFromDate(newDate)
    return new TimezoneDate(newDateString, newTimeString, this._timezone)
  }

  subtract(nb: PositiveInteger, unit: PeriodUnit): TimezoneDate {
    const dayjsUnit = this._toDayjsManipulatedType(unit)
    const newDate = dayjs(this._date).subtract(nb, dayjsUnit).toDate()
    const newDateString = this._getDateStringFromDate(newDate)
    const newTimeString = this._getTimeStringFromDate(newDate)
    return new TimezoneDate(newDateString, newTimeString, this._timezone)
  }

  endOf(unit: PeriodUnit): TimezoneDate {
    const dayjsUnit = this._toDayjsManipulatedType(unit)
    const newDate = dayjs(this._date).tz(this._timezone).endOf(dayjsUnit).toDate()
    const newDateString = this._getDateStringFromDate(newDate)
    const newTimeString = this._getTimeStringFromDate(newDate)
    return new TimezoneDate(newDateString, newTimeString, this._timezone)
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









type TestResult<T> = {
  result: boolean,
  expected: T,
  is: T
}

function expect<TExpected>(expected: TExpected) {
  return {
    toBe: (is: TExpected) => ({ result: expected === is, expected, is })
  }
}

function test<T>(title: string, testFn: () => TestResult<T>) {
  const {result, expected, is} = testFn()
  if(result) {
    console.log(`${title}: success`)
  } else {
    console.warn(`${title}: failed... expected: ${expected}, is: ${is}`)
  }
}


export function TESTS() {

  const tz1 = TimezoneDate.create('2026-02-01' as DateString, '12:00' as TimeString, 'Indian/Mauritius') // --> '2026-02-01T08:00:00.000Z'
  const tz2 = TimezoneDate.createFromDate(new Date('2026-02-01T12:00'), 'Indian/Mauritius') // --> Current user timezone: 'Europe/Zurich' --> '2026-02-01T11:00:00.000Z'

  test('createFromDate() - date argument is passed with user timezone parameter', () => {
    const date = new Date('2026-02-01T12:00') // current platform timezone is 'Europe/Zurich' = +01:00 for this date --> '2026-02-01T11:00:00.000Z'
    const tzDate = TimezoneDate.createFromDate(date, 'Indian/Mauritius')
    return expect(tz2.toDate().toISOString()).toBe('2026-02-01T11:00:00.000Z')
  })

  test('createFromDate() - date argument is passed with user timezone parameter', () => {
    const date = new Date('2026-02-01T12:00') // current platform timezone is 'Europe/Zurich' = +01:00 for this date --> '2026-02-01T11:00:00.000Z'
    const tzDate = TimezoneDate.createFromDate(date, 'Europe/Zurich')
    return expect(tz2.toDate().toISOString()).toBe('2026-02-01T11:00:00.000Z')
  })

  test('format() - test date format "ch"', () => {
    const result = '01.02.2026'
    return expect(tz1.format(DATE_FORMAT.CH)).toBe(result)
  })
  
  test('format() - test date format "us"', () => {
    const result = '02/01/26'
    return expect(tz1.format(DATE_FORMAT.US)).toBe(result)
  })
  
  test('format() - test date format "Platform defined"', () => {
    const result = '01/02/2026'
    return expect(tz1.format(DATE_FORMAT.PLATFORM_DEFINED)).toBe(result)
  })
  
  test('format() - test date format "ISO"', () => {
    const result = '2026-02-01T08:00:00.000Z'
    return expect(tz1.format(DATE_FORMAT.ISO)).toBe(result)
  })

  test('diff() - test1, without floored option', () => {
    const tz = TimezoneDate.create('2026-02-03' as DateString, '12:00' as TimeString, 'Indian/Mauritius')
    return expect(tz1.diff(tz, 'days')).toBe(-2)
  })

  test('diff() - test2, with floored: false option', () => {
    const tz = TimezoneDate.create('2026-02-03' as DateString, '00:00' as TimeString, 'Indian/Mauritius')
    return expect(tz1.diff(tz, 'days', {floored: false})).toBe(-1.5)
  })

  test('add() - milliseconds', () => {
    return expect(
      tz1.add(1 as PositiveInteger, 'milliseconds').format(DATE_FORMAT.ISO)
    ).toBe('2026-02-01T08:00:00.001Z')
  })

  test('add() - seconds', () => {
    return expect(
      tz1.add(1 as PositiveInteger, 'seconds').format(DATE_FORMAT.ISO)
    ).toBe('2026-02-01T08:00:01.000Z')
  })

  test('add() - minutes', () => {
    return expect(
      tz1.add(1 as PositiveInteger, 'minutes').format(DATE_FORMAT.ISO)
    ).toBe('2026-02-01T08:01:00.000Z')
  })

  test('add() - hours', () => {
    return expect(
      tz1.add(1 as PositiveInteger, 'hours').format(DATE_FORMAT.ISO)
    ).toBe('2026-02-01T09:00:00.000Z')
  })

  test('add() - days', () => {
    return expect(
      tz1.add(1 as PositiveInteger, 'days').format(DATE_FORMAT.ISO)
    ).toBe('2026-02-02T08:00:00.000Z')
  })

  test('add() - days End of Month', () => {
    const tz = TimezoneDate.create('2026-02-28' as DateString, '12:00' as TimeString, 'Indian/Mauritius')
    return expect(
      tz.add(1 as PositiveInteger, 'days').format(DATE_FORMAT.ISO)
    ).toBe('2026-03-01T08:00:00.000Z')
  })

  test('add() - weeks', () => {
    return expect(
      tz1.add(1 as PositiveInteger, 'weeks').format(DATE_FORMAT.ISO)
    ).toBe('2026-02-08T08:00:00.000Z')
  })

  test('add() - months', () => {
    return expect(
      tz1.add(1 as PositiveInteger, 'months').format(DATE_FORMAT.ISO)
    ).toBe('2026-03-01T08:00:00.000Z')
  })

  test('add() - years', () => {
    return expect(
      tz1.add(1 as PositiveInteger, 'years').format(DATE_FORMAT.ISO)
    ).toBe('2027-02-01T08:00:00.000Z')
  })

  test('endOf() - milliseconds', () => {
    return expect(
      tz1.endOf('milliseconds').format(DATE_FORMAT.ISO)
    ).toBe('2026-02-01T08:00:00.000Z')
  })

  test('endOf() - seconds', () => {
    return expect(
      tz1.endOf('seconds').format(DATE_FORMAT.ISO)
    ).toBe('2026-02-01T08:00:00.999Z')
  })

  test('endOf() - minutes', () => {
    return expect(
      tz1.endOf('minutes').format(DATE_FORMAT.ISO)
    ).toBe('2026-02-01T08:00:59.999Z')
  })

  test('endOf() - hours', () => {
    return expect(
      tz1.endOf('hours').format(DATE_FORMAT.ISO)
    ).toBe('2026-02-01T08:59:59.999Z')
  })

  test('endOf() - days', () => {
    return expect(
      tz1.endOf('days').format(DATE_FORMAT.ISO)
    ).toBe('2026-02-01T19:59:59.999Z')
  })

  test('endOf() - weeks', () => {
    return expect(
      tz1.endOf('weeks').format(DATE_FORMAT.ISO)
    ).toBe('2026-02-01T19:59:59.999Z')
  })

  test('endOf() - months', () => {
    return expect(
      tz1.endOf('months').format(DATE_FORMAT.ISO)
    ).toBe('2026-02-28T19:59:59.999Z')
  })

  test('endOf() - years', () => {
    return expect(
      tz1.endOf('years').format(DATE_FORMAT.ISO)
    ).toBe('2026-12-31T19:59:59.999Z')
  })

}