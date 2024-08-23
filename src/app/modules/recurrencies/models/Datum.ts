import dayjs from "dayjs";
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'

import { PeriodUnit, toPeriodUnit } from "../types/PeriodUnit";
import { TimeString, toTimeString } from "../types/TimeString";
import { DateString, toDateString } from "../types/DateString";
import { OffsetString, toOffsetString } from "../types/OffsetString";

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




  
export class Datum {
  // DEPENDS ON DAYJS LIBRARY!

  private dayjsDate: dayjs.Dayjs

  constructor(dateString: string, timeString: string = '00:00:00.000', offsetString: string = '+00:00') {
    dayjs.extend(utc)
    dayjs.extend(timezone) 

    const dateStr = toDateString(dateString)
    const timeStr = toTimeString(timeString)
    const offsetStr = toOffsetString(offsetString)
    this.dayjsDate = dayjs(`${dateStr}T${timeStr}${offsetStr}`).utc()
  }

  static TEST() {
    const d1 = new Datum('2024-03-01')
    const d2 = new Datum('2024-02-28')

    console.log(d1.dayjsDate.format())
  }

  format(offset: string = '+00:00', s?: string): string {
    return this.dayjsDate.tz(offset).format(s)
  }

  add(nb: number, unit: PeriodUnit): Datum {
    const newDate = this.dayjsDate.add(nb, unit)
    const newDateString = newDate.format('YYYY-MM-DD')
    const newTimeString = newDate.format('HH:mm:ss.SSS')
    return new Datum(newDateString, newTimeString)
  }

  valueOf(): number {
    return this.dayjsDate.valueOf()
  }


  static now(): Datum {
    const nowDate = dayjs().utc()
    const dateStr = nowDate.format('YYYY-MM-DD')
    const timeStr = nowDate.format('HH:mm:ss.SSS')
    return new Datum(dateStr, timeStr)
  }

  static diff(d1: Datum, d2: Datum, unit: PeriodUnit = 'milliseconds'): number {
    // result = d1 - d2 (positive if d1 > d2)
    const date1 = dayjs(d1.valueOf())
    const date2 = dayjs(d2.valueOf())
    return date1.diff(date2, unit)
  }

}