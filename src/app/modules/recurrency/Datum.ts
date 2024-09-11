import dayjs, { Dayjs } from "dayjs";
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'

import { PeriodUnit, toPeriodUnit } from "./types/PeriodUnit";
import { TimeString, toTimeString } from "./types/TimeString";
import { DateString, toDateString } from "./types/DateString";
import { OffsetString, toOffsetString } from "./types/OffsetString";
import { PositiveInteger } from "./types/PositiveInteger";


interface IDatum {
  toString(opts?: {format?: string, offset?: string}): string,
  valueOf(): number,
  add(nb: number, unit: PeriodUnit): IDatum,
  clone(): IDatum
}

  
export class Datum implements IDatum {
  // DEPENDS ON DAYJS LIBRARY!

  private _dayjsDate: dayjs.Dayjs

  constructor(isoString: string | number) {
    dayjs.extend(utc)
    dayjs.extend(timezone)
    
    if(dayjs(isoString).format() === 'Invalid Date') throw new Error(`Custom Error: Datum constructor invalid argument: "${isoString}"`)
    this._dayjsDate = dayjs.utc(isoString)
  }

  // TODO: convert to dayjs format?
  toString({format = 'YYYY-MM-DDTHH:mm:ss.SSSZ', offset = '+00:00'}: {format?: string, offset?: string} = {}): string {
    try {
      this._dayjsDate.tz(offset)
    }
    catch {
      throw new Error(`Custom Error: Invalid timezone offset: "${offset}"`)
    }

    const conversions = {
      'Year4': 'YYYY',
      'Month2': 'MM',
      'Day2': 'DD',
      'Hours2': 'HH',
      'Minutes2': 'mm',
      'Seconds2': 'ss',
      'Milliseconds3': 'SSS',
      'Offset': 'Z'
    }

    return this._dayjsDate.tz(offset).format(format)
  }

  valueOf(): number {
    return this._dayjsDate.valueOf()
  }

  // TODO: convert to dayjs unit?
  add(nb: number, unit: PeriodUnit): Datum {

    const converted = (unit: PeriodUnit): dayjs.ManipulateType => {
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

    return new Datum(this._dayjsDate.add(nb, converted(unit)).valueOf())
  }

  clone(): Datum {
    return new Datum(this._dayjsDate.valueOf())
  }

  static now(): Datum {
    return new Datum(dayjs().valueOf())
  }

  static diff(datum1: Datum, datum2: Datum, unit: PeriodUnit = 'milliseconds'): number {
    // result = d1 - d2 (positive if d1 > d2)
    const d1 = dayjs(datum1.valueOf())
    const d2 = dayjs(datum2.valueOf())
    return d1.diff(d2, unit)
  }

  static getUserOffset(): string {
    return dayjs().format('Z')
  }

  static TEST() {
    const d1 = new Datum('2024-03-01T14:30+02:00')
    const d2 = new Datum('2024-03-01T12:30:00.900Z')
    const d3 = new Datum(d2.toString())
    const d4 = new Datum('2024-02-28T13:00:01:123')
    const d5 = new Datum('2024-03-01T13:00')

    console.log(d4.toString({format: 'HH:mm:ss.SSS'}))
    // console.log(Datum.diff(d4, d5, 'days'))
  }

}
