// @ts-nocheck

import { Datum } from "./Datum";
import { PeriodUnit, toPeriodUnit } from "../types/PeriodUnit";
import { PositiveInteger, toPositiveInteger } from "../types/PositiveInteger";
import { DateString, toDateString } from "../types/DateString";


export interface IRecurrency {
  id: string,
  title: string,
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

  private _id: string
  private _title: string
  private _lastEvent: Datum
  private _periodNb: PositiveInteger
  private _periodUnit: PeriodUnit

  constructor(title: string, lastEvent: string, periodNb: number, periodUnit: string, id?: string) {
    this._id = id ?? this._generatedId()
    this._title = title
    this._lastEvent = new Datum(lastEvent, SETUP.time, SETUP.offset)
    this._periodNb = toPositiveInteger(periodNb)
    this._periodUnit = toPeriodUnit(periodUnit)
  }

  static TEST() {
    const rec = new Recurrency('EC', '2024-08-22', 94, 'days')
    // console.log(d.add(-47, 'days').format())
  }

  private _generatedId(): string {
    return Math.random().toString()
  }

  id(): string {
    return this._id
  }

  title(): string {
    return this._title
  }

  lastEvent(): Datum {
    return this._lastEvent
  }

  periodNb(): PositiveInteger {
    return this._periodNb
  }

  periodUnit(): PeriodUnit {
    return this._periodUnit
  }

  expiry(): Datum {
    return this._lastEvent.add(this._periodNb, this._periodUnit).add(1, 'milliseconds')
  }

  progress(): number {
    // result = (now - lastEvent) / (expiry - lastEvent)
    // if "now" is before lastEvent (what never should be the case...), result  < 0
    // if "now" is same as lastEvent, result = 0
    // if "now" is between lastEvent and expiry, 0 < result < 1
    // if "now" is same as expiry, result = 1
    // if "now" is after expiry, result > 1

    const now = Datum.now()
    const lastEvent = this._lastEvent
    const expiry = this.expiry()
    return Datum.diff(now, lastEvent) / Datum.diff(expiry, lastEvent)
  }

  remainingPeriod(unit: PeriodUnit): number {
    const expiry = this.expiry()
    const now = Datum.now()
    return Datum.diff(expiry, now, unit)
  }

  setTitle(val: string): Recurrency {
    this._title = val
  }

  setLastEvent(val: string): Recurrency {
    const lastEvent = new Datum(val, SETUP.time, SETUP.offset)
    this._lastEvent = lastEvent
  }

  setPeriodNb(val: number, master: 'lastEvent' | 'expiry'): Recurrency {
    const periodNb = toPositiveInteger(val)
    this._periodNb = periodNb
    
    switch(master) {
      case 'lastEvent':
        {
          return
        }
      case 'expiry':
        {
          const expiry = this.expiry()
          const lastEvent = expiry.add(-periodNb, this._periodUnit)
          this._lastEvent = lastEvent
          return
        }
    }
  }

  setPeriodUnit(val: string, master: 'lastEvent' | 'expiry'): Recurrency {
    const periodUnit = toPeriodUnit(val)
    this._periodUnit = periodUnit
    
    switch(master) {
      case 'lastEvent':
        {
          return
        }
      case 'expiry':
        {
          const expiry = this.expiry()
          const lastEvent = expiry.add(-this._periodNb, periodUnit)
          this._lastEvent = lastEvent
          return
        }
    }
  }

  setExpiry(val: string, master: 'lastEvent' | 'period'): Recurrency {
    switch (master) {
      case 'lastEvent':
        {
          const title = this._title
          const lastEvent = this._lastEvent.format(SETUP.offset, 'YYYY-MM-DD')
          const periodNb = Datum.diff(new Datum(val, SETUP.time, SETUP.offset), this._lastEvent, this._periodUnit)
          const periodUnit = this._periodUnit
          const id = this._id
          return new Recurrency(title, lastEvent, periodNb, periodUnit, id)
        }
      case 'period':
        {
          const title = this._title
          const lastEvent = this._lastEvent.add(-this._periodNb, this._periodUnit).format(SETUP.offset, 'YYYY-MM-DD')
          const periodNb = this._periodNb
          const periodUnit = this._periodUnit
          const id = this._id
          return new Recurrency(title, lastEvent, periodNb, periodUnit, id)
        }
    }
  }

}