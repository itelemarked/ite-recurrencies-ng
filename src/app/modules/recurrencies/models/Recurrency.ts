import { Datum } from "./Datum";
import { PeriodUnit, toPeriodUnit } from "../types/PeriodUnit";
import { PositiveInteger, toPositiveInteger } from "../types/PositiveInteger";
import { DateString, toDateString } from "../types/DateString";


export interface IRecurrency {
  id(): string,
  title(): string,
  lastEvent(): Datum,
  periodNb(): PositiveInteger,
  periodUnit(): PeriodUnit,
  expiry(): Datum,
  progress(): number,
  remainingPeriod(unit: PeriodUnit): number,
  setTitle(val: string): Recurrency,
  setLastEvent(val: string): Recurrency,
  setPeriodNb(val: number, master: 'lastEvent' | 'expiry'): Recurrency,
  setPeriodUnit(val: string, master: 'lastEvent' | 'expiry'): Recurrency,
  setExpiry(val: string, master: 'lastEvent' | 'period'): Recurrency
}

export const SETUP = {
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
    this._lastEvent = new Datum(`${lastEvent}T${SETUP.time}${SETUP.offset}`)
    this._periodNb = toPositiveInteger(periodNb)
    this._periodUnit = toPeriodUnit(periodUnit)
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
    // returns an integer, which is rounded to the floor: e.g 1.9 will result in 1 (days, weeks, ...)
    const expiry = this.expiry()
    const now = Datum.now()
    return Datum.diff(expiry, now, unit)
  }

  setTitle(val: string): Recurrency {    
    return new Recurrency(
      val,
      this._lastEvent.toString({format: 'YYYY-MM-DD', offset: SETUP.offset}),
      this._periodNb,
      this._periodUnit,
      this._id
    )
  }

  setLastEvent(val: string): Recurrency {
    return new Recurrency(
      this._title,
      val,
      this._periodNb,
      this._periodUnit,
      this._id
    )
  }

  setPeriodNb(val: number, master: 'lastEvent' | 'expiry'): Recurrency {
    
    switch(master) {
      case 'lastEvent':
        {
          return new Recurrency(
            this._title,
            this._lastEvent.toString({format: 'YYYY-MM-DD', offset: SETUP.offset}),
            val,
            this._periodUnit,
            this._id
          )
        }
      case 'expiry':
        {
          const lastEvent = this.expiry().add(-1, 'milliseconds').add(-val, this._periodUnit)
          return new Recurrency(
            this._title,
            lastEvent.toString({format: 'YYYY-MM-DD', offset: SETUP.offset}),
            val,
            this._periodUnit,
            this._id
          )
        }
    }
  }

  setPeriodUnit(val: string, master: 'lastEvent' | 'expiry'): Recurrency {
    
    switch(master) {
      case 'lastEvent':
        {
          return new Recurrency(
            this._title,
            this._lastEvent.toString({format: 'YYYY-MM-DD', offset: SETUP.offset}),
            this._periodNb,
            val,
            this._id
          )
        }
      case 'expiry':
        {
          const lastEvent = this.expiry().add(-1, 'milliseconds').add(-this._periodNb, toPeriodUnit(val))
          return new Recurrency(
            this._title,
            lastEvent.toString({format: 'YYYY-MM-DD', offset: SETUP.offset}),
            this._periodNb,
            val,
            this._id
          )
        }
    }
  }

  setExpiry(val: string, master: 'lastEvent' | 'period'): Recurrency {
    const expiry = new Datum(`${val}T00:00:00${SETUP.offset}`)
    switch (master) {
      case 'lastEvent':
        {
          const periodNb = Datum.diff(expiry.add(-1, 'milliseconds'), this._lastEvent, this._periodUnit)
          return new Recurrency(
            this._title,
            this._lastEvent.toString({format: 'YYYY-MM-DD', offset: SETUP.offset}),
            periodNb,
            this._periodUnit,
            this._id
          )
        }
      case 'period':
        const lastEvent = expiry.add(-1, 'milliseconds').add(-this._periodNb, this._periodUnit)
        return new Recurrency(
          this._title,
          lastEvent.toString({format: 'YYYY-MM-DD', offset: SETUP.offset}),
          this._periodNb,
          this._periodUnit,
          this._id
        )
    }
  }

  static TEST() {
    // console.log(d1.expiry().toString({format: 'DD.MM.YYYY HH:mm:ss.SSS Z', offset: SETUP.offset}))
    // console.log(d1.remainingPeriod('days'))

    const d2 = new Recurrency('aaa', '2024-02-28', 94, 'days')
    const d3 = d2.setExpiry('2024-03-02', 'lastEvent')
    // console.log(d3.lastEvent().toString({format: 'DD.MM.YYYY HH:mm:ss.SSS Z', offset: SETUP.offset}))
    // console.log(d3.periodNb())

    // TODO: test all setter methods (setExpiry() already done...)
  }
}