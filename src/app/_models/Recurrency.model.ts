import { DateString } from "../_types/DateString.type";
import { Datum } from "./Datum.model";
import { OffsetString, toOffsetString } from "../_types/OffsetString.type";
import { PeriodUnit, toPeriodUnit } from "../_types/PeriodUnit.type";
import { PositiveInteger, toPositiveInteger } from "../_types/PositiveInteger.type";
import { IRecurrency, IRecurrencyData, IRecurrencyOptions } from "../_types/Recurrency.interface";
import { IDatum } from "../_types/Datum.interface";

export const SETUP = {
  offset: '+01:00'
}


export class Recurrency implements IRecurrency {

  private _id: string
  private _title: string
  private _lastEvent: IDatum
  private _periodNb: PositiveInteger
  private _periodUnit: PeriodUnit
  private _offset: OffsetString

  private constructor({ title, lastEvent, periodNb, periodUnit, id }: IRecurrencyData, { offset }: IRecurrencyOptions) {
    const LAST_EVENT_TIME = '23:59:59.999'
    const offsetString = !!offset ? toOffsetString(offset) : toOffsetString('+00:00')
    
    this._title = title
    this._lastEvent = Datum.fromIsoString(`${lastEvent}T${LAST_EVENT_TIME}${offsetString}`)
    this._periodNb = toPositiveInteger(periodNb)
    this._periodUnit = toPeriodUnit(periodUnit)
    this._id = id ?? this._generatedId()
    this._offset = offsetString
  }

  private _generatedId(): string {
    return Math.random().toString()
  }

  private _getProps(): Required<IRecurrencyData> {
    return {
      title: this._title,
      lastEvent: this._lastEvent.toString({format: 'YYYY-MM-DD', offset: this._offset}),
      periodNb: this._periodNb,
      periodUnit: this._periodUnit,
      id: this._id
    }
  }

  private _getOptions(): Required<IRecurrencyOptions> {
    return {
      offset: this._offset
    }
  }

  static from(props: IRecurrencyData, opts: IRecurrencyOptions) {
    return new Recurrency(props, opts)
  }

  id(): string {
    return this._id
  }

  title(): string {
    return this._title
  }

  lastEvent(): IDatum {
    return this._lastEvent.clone()
  }

  // lastEvent({format = 'YYYY-MM-DDTHH:mm:ss.SSSZ'}: {format?: string} = {}): string {
  //   return this._lastEvent.clone()
  // }


  periodNb(): PositiveInteger {
    return this._periodNb
  }

  periodUnit(): PeriodUnit {
    return this._periodUnit
  }

  expiry(): IDatum {
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
    const newProps = {...this._getProps(), title: val}
    const opts = this._getOptions()
    return new Recurrency(newProps, opts)
  }

  setLastEvent(val: string): Recurrency {
    const newProps = {...this._getProps(), lastEvent: val}  
    const opts = this._getOptions()
    return new Recurrency(newProps, opts)
  }

  setPeriodNb(val: number, master: 'lastEvent' | 'expiry'): Recurrency {
    switch(master) {
      case 'lastEvent':
        {
          const newProps = {...this._getProps(), periodNb: val}  
          const opts = this._getOptions()
    return new Recurrency(newProps, opts)
        }
      case 'expiry':
        {
          const lastEventDatum = this.expiry().add(-1, 'milliseconds').add(-val, this._periodUnit)
          const lastEvent = lastEventDatum.toString({format: 'YYYY-MM-DD', offset: this._offset})
          const newProps = {...this._getProps(), lastEvent}  
          const opts = this._getOptions()
          return new Recurrency(newProps, opts)
        }
    }
  }

  setPeriodUnit(val: string, master: 'lastEvent' | 'expiry'): Recurrency {
    switch(master) {
      case 'lastEvent':
        {
          const newProps = {...this._getProps(), periodUnit: val}  
          const opts = this._getOptions()
          return new Recurrency(newProps, opts)
        }
      case 'expiry':
        {
          const lastEventDatum = this.expiry().add(-1, 'milliseconds').add(-this._periodNb, toPeriodUnit(val))
          const lastEvent = lastEventDatum.toString({format: 'YYYY-MM-DD', offset: this._offset})
          const newProps = {...this._getProps(), periodUnit: val, lastEvent}  
          const opts = this._getOptions()
          return new Recurrency(newProps, opts)
        }
    }
  }

  setExpiry(val: string, master: 'lastEvent' | 'period'): Recurrency {
    const expiry = Datum.fromIsoString(`${val}T00:00:00${this._offset}`)
    switch (master) {
      case 'lastEvent':
        {
          const periodNb = Datum.diff(expiry.add(-1, 'milliseconds'), this._lastEvent, this._periodUnit)
          const newProps = {...this._getProps(), periodNb}  
          const opts = this._getOptions()
          return new Recurrency(newProps, opts)
        }
      case 'period':
        const lastEventDatum = expiry.add(-1, 'milliseconds').add(-this._periodNb, this._periodUnit)
        const lastEvent = lastEventDatum.toString({format: 'YYYY-MM-DD', offset: this._offset})
        const newProps = {...this._getProps(), lastEvent}  
        const opts = this._getOptions()
        return new Recurrency(newProps, opts)
    }
  }

  setOffset(val: string): Recurrency {
    const props = this._getProps()
    const opts = { offset: val }
    return new Recurrency(props, opts)
  }

  clone(): Recurrency {
    return new Recurrency(this._getProps(), this._getOptions())
  }

  static TEST() {}
}