import dayjs from "dayjs";
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import { PeriodUnit } from "../_types/PeriodUnit";
import { IDatum } from "../_interfaces/IDatum";


interface IDatumStatic {
  fromIsoString(isoString: string): Datum
  fromMilliseconds(ms: number): Datum
  now(): Datum,
  diff(datum1: Datum, datum2: Datum, unit?: PeriodUnit): number,
  getUserOffset(): string 
}

  
export class Datum implements IDatum {
  
  /**
   * DEPENDS ON DAYJS LIBRARY!
   */
  private _dayjsDate: dayjs.Dayjs

  /**
   * 
   * @param isoStringOrMs creates a dayjs Date object.
   *  
   * isoString without time will default to midnight in UTC (2024-06-06 -> 2024-06-06T00:00:00+00:00).
   * isoString with time and without offset will default to UTC time (2024-06-06T13:00 -> 2024-06-06T13:00:00+00:00).
   * isoString with time and offset will be set according offset zone (2024-06-06T13:00+03:00 --> 2024-06-06T10:00:00.000+00:00)
   * 
   * The user offset won't never be taken into account --> offset must be specified if anything but UTC is requested!
   * 
   * Constructor is private. Instanciation of a Datum object with new Datum() will throw an error. Use Datum.fromIsoString() or Datum.fromMilliseconds() to create a Datum object. 
   */
  private constructor(isoStringOrMs: string | number) {
    dayjs.extend(utc)
    dayjs.extend(timezone)
    
    if(dayjs(isoStringOrMs).format() === 'Invalid Date') throw new Error(`Custom Error: Datum constructor invalid argument: "${isoStringOrMs}"`)
    this._dayjsDate = dayjs.utc(isoStringOrMs)
  }

  /**
   * static constructor function
   * @param isoString any string which cound be passed to a dayjs constructor.
   * @returns Datum
   */
  static fromIsoString(isoString: string): IDatum {
    return new Datum(isoString)
  }

  /**
   * static constructor function
   * @param ms a number in milliseconds, corresponding to a date in ms after 1970-01-01
   * @returns Datum
   */
  static fromMilliseconds(ms: number): IDatum {
    return new Datum(ms)
  }

  
  toString({format = 'YYYY-MM-DDTHH:mm:ss.SSSZ', offset = '+00:00'}: {format?: string, offset?: string} = {}): string {
    try {
      this._dayjsDate.tz(offset)
    }
    catch {
      throw new Error(`Custom Error: Invalid timezone offset: "${offset}"`)
    }

    // TODO?: convert to dayjs format? or use the dayjs ones???
    // const conversions = {
    //   '/Year4/': 'YYYY',
    //   '/Month2/': 'MM',
    //   '/Day2/': 'DD',
    //   '/Hours2/': 'HH',
    //   '/Minutes2/': 'mm',
    //   '/Seconds2/': 'ss',
    //   '/Milliseconds3/': 'SSS',
    //   '/Offset/': 'Z'
    // }

    return this._dayjsDate.tz(offset).format(format)
  }

  valueOf(): number {
    return this._dayjsDate.valueOf()
  }

  add(nb: number, unit: PeriodUnit): IDatum {
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

  clone(): IDatum {
    return new Datum(this._dayjsDate.valueOf())
  }

  static now(): IDatum {
    return new Datum(dayjs().valueOf())
  }

  static diff(datum1: IDatum, datum2: IDatum, unit: PeriodUnit = 'milliseconds'): number {
    // result = d1 - d2 (positive if d1 > d2)
    const d1 = dayjs(datum1.valueOf())
    const d2 = dayjs(datum2.valueOf())
    return d1.diff(d2, unit)
  }

  static getUserOffset(): string {
    return dayjs().format('Z')
  }

  static TEST() {
    // const d1 = new Datum('2024-03-01T13:00')
    
    // console.log(dayjs(1).toISOString())
    // const d2 = new Datum('2024-03-01T12:30:00.900Z')
    // const d3 = new Datum(d2.toString())
    // const d4 = new Datum('2024-02-28T13:00:01:123')
    // const d5 = new Datum('2024-03-01T13:00')

    // console.log(d4.toString({format: 'HH:mm:ss.SSS'}))
    // // console.log(Datum.diff(d4, d5, 'days'))
  }

}
