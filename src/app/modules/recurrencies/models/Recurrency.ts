import { Datum } from "./Datum";
import { PeriodUnit, toPeriodUnit } from "../types/PeriodUnit";
import { PositiveInteger, toPositiveInteger } from "../types/PositiveInteger";
import { DateString, toDateString } from "../types/DateString";


export interface IRecurrency {
  id: string,
  lastEvent: Datum,
  periodNb: PositiveInteger,
  periodUnit: PeriodUnit,
}

// export class Recurrency implements IRecurrency {

//   private _periodUnit: PeriodUnit

//   get periodUnit(): PeriodUnit {
//     return this._periodUnit;
//   }

//   set periodUnit(val: string) {
//     this._periodUnit = toPeriodUnit(val)
//     // do something else
//   }

//   constructor(periodUnit: string) {
//     this._periodUnit = toPeriodUnit(periodUnit)
//   }

// }

const SETUP = {
  time: '23:59:59.999',
  offset: '+02:00'
}

export class Recurrency {

  id: string
  lastEvent: Datum
  periodNb: PositiveInteger
  periodUnit: PeriodUnit

  constructor(lastEvent: string, periodNb: number, periodUnit: string) {
    this.id = this._generatedId()
    this.lastEvent = new Datum(lastEvent, SETUP.time, SETUP.offset)
    this.periodNb = toPositiveInteger(periodNb)
    this.periodUnit = toPeriodUnit(periodUnit)
  }

  static TEST() {
    const rec = new Recurrency('2024-08-22', 94, 'days')
    // console.log(d.add(-47, 'days').format())
    console.log(rec.getRemainingPeriod('days'))
  }

  private _generatedId(): string {
    return Math.random().toString()
  }

  getExpiry(): Datum {
    return this.lastEvent.add(this.periodNb, this.periodUnit).add(1, 'milliseconds')
  }

  getProgress(): number {
    // result = (now - lastEvent) / (expiry - lastEvent)
    // if "now" is before lastEvent (what never should be the case...), result  < 0
    // if "now" is same as lastEvent, result = 0
    // if "now" is between lastEvent and expiry, 0 < result < 1
    // if "now" is same as expiry, result = 1
    // if "now" is after expiry, result > 1

    const now = Datum.now()
    const lastEvent = this.lastEvent
    const expiry = this.getExpiry()
    return Datum.diff(now, lastEvent) / Datum.diff(expiry, lastEvent)
  }

  getRemainingPeriod(unit: PeriodUnit): number {
    const expiry = this.getExpiry()
    const now = Datum.now()
    return Datum.diff(expiry, now, unit)
  }

}