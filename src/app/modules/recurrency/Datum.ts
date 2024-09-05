import dayjs, { Dayjs } from "dayjs";
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'

import { PeriodUnit, toPeriodUnit } from "./types/PeriodUnit";
import { TimeString, toTimeString } from "./types/TimeString";
import { DateString, toDateString } from "./types/DateString";
import { OffsetString, toOffsetString } from "./types/OffsetString";
import { PositiveInteger } from "./types/PositiveInteger";

// interface IDatum {
//   dateString: DateString,
//   timeString: TimeString,
//   offsetString: OffsetString,
//   // constructor(dateString: string, timeString?: string, offsetString?: string)
//   format(s: string): string,    // Formatted: DD.MM.YYYY HH:mm:ss.sss +hh:mm
//   toDateStringCH(): string                                      // Formatted: YYYY-MM-DD[T]HH:mm:ss.sss+hh:mm
//   valueOf(): number                                          // Returns the primitive value of the date (a number)
//   add(nb: number, unit: PeriodUnit): IDatum
// }

// export class Datum {
//   // DEPENDS ON DAYJS LIBRARY!

//   dateString: DateString
//   timeString: TimeString      // defaults to 00:00:000.000
//   offsetString: OffsetString  // default to UTC (+00:00)

//   constructor(dateString: string, timeString: string = '00:00:00.000', offsetString: string = '+00:00') {
//     dayjs.extend(utc)
//     dayjs.extend(timezone)  
//     this.dateString = toDateString(dateString)
//     this.timeString = toTimeString(timeString)
//     this.offsetString = toOffsetString(offsetString)
//   }

//   static TEST() {
//     const d = new Datum('2024-07-06', '15:22:00.000')
//     // console.log(d.add(-2, 'days').toISOString())
//     // console.log(d.add(2, 'days').toISOString())
//     // const d2 = dayjs('2024-08-22').add(94, 'days').format('YYYY-MM-DD')
//     // console.log(d2)
//     // console.log(d.toISOString())
//     // const datum = dayjs(`${d.dateString}T${d.timeString}`).tz(`${d.offsetString}`, true)
//     // console.log(datum.valueOf())
//     // const d2 = new Date('2024-08-22T12:01:33.334+05:00')
//     // console.log(d2.valueOf())
//     // const a: PeriodUnit = toPeriodUnit('day')

//     // const now = Datum.now('+02:00')
//     // console.log(Datum.diff(now, d, 'days'))
    
//     // const d1 = dayjs('2024-03-01T12:00:00').tz('+03:00', true)
//     // const d2 = dayjs('2024-02-28T12:00:00').tz('+03:00', true)

//     // const d1 = new Datum('2024-03-01', '12:00:00.000', '+03:00')
//     // const d2 = new Datum('2024-02-28', '12:00:00.000', '+03:00')
//     // console.log(Datum.diff(d1, d2, 'days'))

//     console.log(dayjs('2024-06-02T15:00:00+03:00').utc().format())
//   }

//   private _getDayjs(): dayjs.Dayjs {
//     return dayjs(`${this.dateString}T${this.timeString}`).tz(`${this.offsetString}`, true)
//   }

//   format(offset: string = '+00:00', s?: string): string {
//     // return this._getDayjs().format(s)
//     return dayjs(`${this.dateString}T${this.timeString}`).tz(offset).format(s)
//   }

//   toDateStringCH(): string {
//     // format shortcut
//     return this._getDayjs().format('DD.MM.YYYY')
//   }

//   toISOString(): string {
//     // format shortcut
//     return this._getDayjs().format('YYYY-MM-DD[T]HH:mm:ss.SSSZ')
//   }

//   add(nb: number, unit: PeriodUnit): Datum {
//     const newDate = this._getDayjs().add(nb, unit)
//     const newDateString = newDate.format('YYYY-MM-DD')
//     const newTimeString = newDate.format('HH:mm:ss.SSS')
//     const newOffsetString = newDate.format('Z')
//     return new Datum(newDateString, newTimeString, newOffsetString)
//   }

//   valueOf(): number {
//     return this._getDayjs().valueOf()
//   }

//   static now(offsetString: string = '+00:00'): Datum {
//     // const now = dayjs().tz(`${this.offsetString}`, true)
//     // const newDateString = now.format('YYYY-MM-DD')
//     // const newTimeString = now.format('HH:mm:ss.SSS')
//     // const newOffsetString = now.format('Z')
//     // return new Datum(newDateString, newTimeString, newOffsetString)
//     const offset = toOffsetString(offsetString)
//     const now = dayjs().tz(offset)
//     const newDateString = now.format('YYYY-MM-DD')
//     const newTimeString = now.format('HH:mm:ss.SSS')
//     return new Datum(newDateString, newTimeString, offset)
//   }

//   static diff(d1: Datum, d2: Datum, unit: PeriodUnit = 'milliseconds'): number {
//     // result = d1 - d2 (positive if d1 > d2)
//     return d1._getDayjs().diff(d2._getDayjs(), unit)
//   }

// }





// export class Datum {
//   // DEPENDS ON DAYJS LIBRARY!

//   private dayjsDate: dayjs.Dayjs

//   constructor(dateString: string, timeString: string = '00:00:00.000', offsetString: string = '+00:00') {
//     dayjs.extend(utc)
//     dayjs.extend(timezone) 

//     const dateStr = toDateString(dateString)
//     const timeStr = toTimeString(timeString)
//     const offsetStr = toOffsetString(offsetString)
//     this.dayjsDate = dayjs(`${dateStr}T${timeStr}${offsetStr}`).utc()
//   }

//   static TEST() {
//     const d1 = new Datum('2024-03-01')
//     const d2 = new Datum('2024-02-28')

//     console.log(d1.dayjsDate.format())
//   }

//   format(offset: string = '+00:00', s?: string): string {
//     return this.dayjsDate.tz(offset).format(s)
//   }

//   add(nb: number, unit: PeriodUnit): Datum {
//     const newDate = this.dayjsDate.add(nb, unit)
//     const newDateString = newDate.utc().format('YYYY-MM-DD')
//     const newTimeString = newDate.utc().format('HH:mm:ss.SSS')
//     return new Datum(newDateString, newTimeString)
//   }

//   valueOf(): number {
//     return this.dayjsDate.valueOf()
//   }

//   clone(): Datum {
//     const newDateString = this.dayjsDate.utc().format('YYYY-MM-DD')
//     const newTimeString = this.dayjsDate.utc().format('HH:mm:ss.SSS')
//     return new Datum(newDateString, newTimeString)
//   }

//   static now(): Datum {
//     const nowDate = dayjs().utc()
//     const dateStr = nowDate.format('YYYY-MM-DD')
//     const timeStr = nowDate.format('HH:mm:ss.SSS')
//     return new Datum(dateStr, timeStr)
//   }

//   static diff(d1: Datum, d2: Datum, unit: PeriodUnit = 'milliseconds'): number {
//     // result = d1 - d2 (positive if d1 > d2)
//     const date1 = dayjs(d1.valueOf())
//     const date2 = dayjs(d2.valueOf())
//     return date1.diff(date2, unit)
//   }

// }


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
