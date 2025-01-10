
import { PeriodUnit } from "../types/PeriodUnit.type";
import dayjs from "dayjs";
import utc  from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { BehaviorSubject } from "rxjs";
import { DateString, toDateString } from "../types/DateString.type";

/**
 * 
 * timezoneDate()
 * add()
 * endOf()
 * diff()
 * format()
 * 
 */


// ************** DAYJS **************

// TODO: SETTINGS OF THE APP???

const SETTINGS = {
  LOCALE: 'fr-CH',
  TIMEZONE: 'Europe/Zurich'
}

class SettingService {
  private _settings$ = new BehaviorSubject(SETTINGS) 

  getSettings$() {
    return this._settings$.asObservable()
  }
}
const settingService = new SettingService()




settingService.getSettings$().subscribe(settings => {
  initDayjs(settings)
})

function initDayjs(settings: any) {
  dayjs.extend(utc)
  dayjs.extend(timezone)
  dayjs.locale(settings.LOCALE, {
    weekStart: 1
  })
  dayjs.tz.setDefault(settings.TIMEZONE)
}




export function timezoneDate(dateTime: string | Date): Date {
  return dayjs.tz(dateTime).toDate()
}


const isObjectLiteral = (o: any, opts?: { hasKeys: string[] } ) => {
  const isObjLiteral = o !== null && o !== undefined && Object.getPrototypeOf(o) === Object.prototype
  if (!isObjLiteral) return false
  if (opts === undefined) return isObjLiteral
  const hasKeys = opts.hasKeys.every(key => key in o)
  return isObjLiteral && hasKeys
}

export function timezoneDate2(date: Date): Date
export function timezoneDate2({ dateString, timeString, timezone }: { dateString: DateString, timeString?: string, timezone?: string }): Date
export function timezoneDate2(...args: any): Date {

  const byDate = (date: Date): Date => date
  
  const byOpts = ({ dateString, timeString, timezone }: { dateString: DateString, timeString?: string, timezone?: string }): Date => {
    const dateTime = `${dateString}T${timeString}`
    return dayjs(dateTime).tz(timezone, true).toDate()
  }

  if(!isObjectLiteral(args[0])) return byDate(args[0])
  return byOpts({dateString: args[0], timeString: args[1], timezone: args[3]})
}

export function add(date: Date, nb: number, unit: PeriodUnit): Date {
  // In that particular case, DayjsUnit contains every PeriodUnit --> no need to convert to DayjsUnit!!
  type DayjsUnit = any
  const toDayjsUnit = (unit: PeriodUnit): DayjsUnit => unit
  return dayjs.tz(date).add(nb, toDayjsUnit(unit)).toDate()
}

export function endOf(date: Date, unit: PeriodUnit): Date {
  // In that particular case, DayjsUnit contains every PeriodUnit --> no need to convert to DayjsUnit!!
  type DayjsUnit = any
  const toDayjsUnit = (unit: PeriodUnit): DayjsUnit => unit
  return dayjs.tz(date).endOf(toDayjsUnit(unit)).toDate()
}


// ************** NATIVE DATE OBJECT **************

function clone(date: Date) {
  return new Date(date)
}

// export function add(date: Date, nb: number, unit: PeriodUnit = 'milliseconds'): Date {
//   const addMilliseconds = (date: Date, nb: number) => new Date(clone(date).setUTCMilliseconds(date.getUTCMilliseconds() + nb))
//   const addSeconds = (date: Date, nb: number) => new Date(clone(date).setUTCSeconds(date.getUTCSeconds() + nb))
//   const addMinutes = (date: Date, nb: number) => new Date(clone(date).setUTCMinutes(date.getUTCMinutes() + nb))
//   const addHours = (date: Date, nb: number) => new Date(clone(date).setUTCHours(date.getUTCHours() + nb))
//   const addDays = (date: Date, nb: number) => new Date(clone(date).setUTCDate(date.getUTCDate() + nb))
//   const addWeeks = (date: Date, nb: number) => new Date(clone(date).setUTCDate(date.getUTCDate() + nb * 7))
//   const addMonths = (date: Date, nb: number) => new Date(clone(date).setUTCMonth(date.getUTCMonth() + nb))
//   const addYears = (date: Date, nb: number) => new Date(clone(date).setUTCFullYear(date.getUTCFullYear() + nb))

//   switch (unit) {
//     case 'milliseconds': return addMilliseconds(date, nb)
//     case 'seconds': return addSeconds(date, nb)
//     case 'minutes': return addMinutes(date, nb)
//     case 'hours': return addHours(date, nb)
//     case 'days': return addDays(date, nb)
//     case 'weeks': return addWeeks(date, nb * 7)
//     case 'months': return addMonths(date, nb)
//     case 'years': return addYears(date, nb)
//   }
// }







// ************** TIMEZONE LIBRARY **************

// WARNING: DOESN'T TAKE MILLISECONDS INTO ACCOUNT...
// export function timezoneDate(dateTime: string | Date, timezone: string): Date {
//  return TEMPO.tzDate(dateTime, timezone)
// }

// WARNING: DOESN'T TAKE MILLISECONDS INTO ACCOUNT...
// export function add(date: Date, nb: number, unit: PeriodUnit = 'milliseconds'): Date {
//   switch (unit) {
//     case 'milliseconds': return new Date(date.valueOf() + nb)
//     case 'seconds': return TEMPO.addSecond(date, nb)
//     case 'minutes': return TEMPO.addMinute(date, nb)
//     case 'hours': return TEMPO.addHour(date, nb)
//     case 'days': return TEMPO.addDay(date, nb)
//     case 'weeks': return TEMPO.addDay(date, nb * 7)
//     case 'months': return TEMPO.addMonth(date, nb)
//     case 'years': return TEMPO.addYear(date, nb)
//   }
// }

// WARNING: DOESN'T TAKE MILLISECONDS INTO ACCOUNT...
// export function endOf(date: Date, unit: PeriodUnit = 'milliseconds'): Date {
//   switch(unit) {
//     case 'milliseconds': {
//       const dateCopy = new Date(date)
//       const newMilliseconds = dateCopy.getUTCMilliseconds() + 1
//       return new Date(dateCopy.setMilliseconds(newMilliseconds))
//     }
//     case 'seconds': {
//       const newSecond = clone(date).getUTCSeconds() + 1
//       return new Date(clone(date).setSeconds(newSecond, 0))
//     }
//     case 'minutes': return TEMPO.minuteEnd(date)
//     case 'hours': return TEMPO.hourEnd(date)
//     case 'days': return TEMPO.dayEnd(date)
//     case 'weeks': return TEMPO.weekEnd(date)
//     case 'months': return TEMPO.monthEnd(date)
//     case 'years': return TEMPO.yearEnd(date)
//   }
// }



// export function endOf(date: Date, unit: PeriodUnit = 'milliseconds'): Date {
//   // const endOfMilliseconds = (date: Date, nb: number) => new Date(clone(date).setUTCMilliseconds(date.getUTCMilliseconds() + nb))
//   // const endOfSeconds = (date: Date, nb: number) => new Date(clone(date).setUTCSeconds(date.getUTCSeconds() + nb))
//   // const endOfMinutes = (date: Date, nb: number) => new Date(clone(date).setUTCMinutes(date.getUTCMinutes() + nb))
//   // const endOfHours = (date: Date, nb: number) => new Date(clone(date).setUTCHours(date.getUTCHours() + nb))
//   const endOfDay = (date: Date, nb: number) => clone(date).setDate(date.getDate())
//   // const endOfWeeks = (date: Date, nb: number) => new Date(clone(date).setUTCDate(date.getUTCDate() + nb * 7))
//   // const endOfMonths = (date: Date, nb: number) => new Date(clone(date).setUTCMonth(date.getUTCMonth() + nb))
//   // const endOfYears = (date: Date, nb: number) => new Date(clone(date).setUTCFullYear(date.getUTCFullYear() + nb))

//   switch (unit) {
//     case 'milliseconds': return endOfMilliseconds(date, nb)
//     case 'seconds': return endOfSeconds(date, nb)
//     case 'minutes': return endOfMinutes(date, nb)
//     case 'hours': return endOfHours(date, nb)
//     case 'days': return endOfDays(date, nb)
//     case 'weeks': return endOfWeeks(date, nb * 7)
//     case 'months': return endOfMonths(date, nb)
//     case 'years': return endOfYears(date, nb)
//   }
// }

// type DiffRoundingMethod = "trunc" | "round" | "floor" | "ceil"

// export function diff(date1: Date, date2: Date, unit: PeriodUnit = 'milliseconds', roundingMethod: DiffRoundingMethod = 'trunc'): number {
//   switch (unit) {
//     case 'milliseconds': return TEMPO.diffMilliseconds(date1, date2)
//     case 'seconds': return TEMPO.diffSeconds(date1, date2, roundingMethod)
//     case 'minutes': return TEMPO.diffMinutes(date1, date2, roundingMethod)
//     case 'hours': return TEMPO.diffHours(date1, date2, roundingMethod)
//     case 'days': return TEMPO.diffDays(date1, date2, roundingMethod)
//     case 'weeks': return TEMPO.diffWeeks(date1, date2, roundingMethod)
//     case 'months': return TEMPO.diffMonths(date1, date2)
//     case 'years': return TEMPO.diffYears(date1, date2)
//   }
// }

// export function format(date: Date | string, formatStyle: TEMPO.Format, locale: string): string {
//   return TEMPO.format(date, formatStyle, locale)
// }





export function TEST() {
  // const recService = new RecurrencyService()
  // recService.getById$('PU').subscribe(pu => {
  //   if(pu === undefined) return
  //   console.log(pu.lastEvent.toISOString())
  //   console.log(endOf(pu.lastEvent, 'weeks').toISOString())
  //   console.log(pu.lastEvent.toISOString())
  // })

  // const d1 = new Date(`2024-06-01T12:12:12.122Z`)
  // console.log(`milliseconds: ${add(d1, 2, 'milliseconds').toISOString() === '2024-06-01T12:12:12.124Z'}`)
  // console.log(`seconds: ${add(d1, 2, 'seconds').toISOString() === '2024-06-01T12:12:14.122Z'}`)
  // console.log(`minutes: ${add(d1, 2, 'minutes').toISOString() === '2024-06-01T12:14:12.122Z'}`)
  // console.log(`hours: ${add(d1, 2, 'hours').toISOString() === '2024-06-01T14:12:12.122Z'}`)
  // console.log(`days: ${add(d1, 2, 'days').toISOString() === '2024-06-03T12:12:12.122Z'}`)
  // console.log(`weeks: ${add(d1, 2, 'weeks').toISOString() === '2024-06-15T12:12:12.122Z'}`)
  // console.log(`months: ${add(d1, 2, 'months').toISOString() === '2024-08-01T12:12:12.122Z'}`)
  // console.log(`years: ${add(d1, 2, 'years').toISOString() === '2026-06-01T12:12:12.122Z'}`)

  // Testing with timezone Europe/Zurich
  // const d1 = timezoneDate(`2024-06-01 12:12:12.122`) 
  // console.log(`milliseconds: ${endOf(d1, 'milliseconds').toISOString() === '2024-06-01T10:12:12.122Z'}`)
  // console.log(`seconds: ${endOf(d1, 'seconds').toISOString() === '2024-06-01T10:12:12.999Z'}`)
  // console.log(`minutes: ${endOf(d1, 'minutes').toISOString() === '2024-06-01T10:12:59.999Z'}`)
  // console.log(`hours: ${endOf(d1, 'hours').toISOString() === '2024-06-01T10:59:59.999Z'}`)
  // console.log(`days: ${endOf(d1, 'days').toISOString() === '2024-06-01T21:59:59.999Z'}`)
  // console.log(`weeks: ${endOf(d1, 'weeks').toISOString() === '2024-06-02T21:59:59.999Z'}`)
  // console.log(`months: ${endOf(d1, 'months').toISOString() === '2024-06-30T21:59:59.999Z'}`)
  // console.log(`years: ${endOf(d1, 'years').toISOString() === '2024-12-31T22:59:59.999Z'}`)
  // console.log(`years: ${endOf(d1, 'years').toISOString()}`)
  // console.log(d1.toISOString())

  // const d1 = timezoneDate(`2024-06-01T12:12:12.122`)

  // const d1 = timezoneDate2({ date: toDateString('2024-06-01') })

  class G {
    x = 1
  }

  const a = {}
  const b = {x: 1}
  const c = () => {}
  const d = 'aaa'
  const e = null
  const f = undefined
  const g = new G()
  const h = new Date()

  // console.log(`a: ${typeof a === 'object'}`)     // true
  // console.log(`b: ${typeof b === 'object'}`)     // true
  // console.log(`c: ${typeof c === 'object'}`)
  // console.log(`d: ${typeof d === 'object'}`)
  // console.log(`e: ${typeof e === 'object'}`)     // true
  // console.log(`f: ${typeof f === 'object'}`)
  // console.log(`g: ${typeof g === 'object'}`)     // true

  // console.log(`a: ${'x' in a}`)
  // console.log(`b: ${'x' in b}`)                  // true
  // console.log(`c: ${'x' in c}`)
  // // console.log(`d: ${'x' in d}`)
  // // console.log(`e: ${'x' in e}`)
  // // console.log(`f: ${'x' in f}`)
  // console.log(`g: ${'x' in g}`)                  // true

  // console.log(`a: ${a.hasOwnProperty('x')}`)
  // console.log(`b: ${b.hasOwnProperty('x')}`)     // true
  // console.log(`c: ${c.hasOwnProperty('x')}`)
  // console.log(`d: ${d.hasOwnProperty('x')}`)
  // // console.log(`e: ${e.hasOwnProperty('x')}`)
  // // console.log(`f: ${f.hasOwnProperty('x')}`)
  // console.log(`g: ${g.hasOwnProperty('x')}`)     // true

  // console.log(`a: ${Object.getPrototypeOf(a) === Object.prototype}`)    // true
  // console.log(`b: ${Object.getPrototypeOf(b) === Object.prototype}`)    // true
  // console.log(`c: ${Object.getPrototypeOf(c) === Object.prototype}`)
  // console.log(`d: ${Object.getPrototypeOf(d) === Object.prototype}`)
  // // console.log(`e: ${Object.getPrototypeOf(e) === Object.prototype}`)
  // // console.log(`f: ${Object.getPrototypeOf(f) === Object.prototype}`)
  // console.log(`g: ${Object.getPrototypeOf(g) === Object.prototype}`)



  // console.log(`a: ${isObjectLiteral(a, { hasKeys: ['x'] })}`) 
  // console.log(`b: ${isObjectLiteral(b, { hasKeys: ['x'] })}`) 
  // console.log(`c: ${isObjectLiteral(c, { hasKeys: ['x'] })}`)
  // console.log(`d: ${isObjectLiteral(d, { hasKeys: ['x'] })}`)
  // console.log(`e: ${isObjectLiteral(e, { hasKeys: ['x'] })}`) 
  // console.log(`f: ${isObjectLiteral(f, { hasKeys: ['x'] })}`)
  // console.log(`g: ${isObjectLiteral(g, { hasKeys: ['x'] })}`) 

  // console.log(`a: ${isObjectLiteral(a)}`) 
  // console.log(`b: ${isObjectLiteral(b)}`) 
  // console.log(`c: ${isObjectLiteral(c)}`)
  // console.log(`d: ${isObjectLiteral(d)}`)
  // console.log(`e: ${isObjectLiteral(e)}`) 
  // console.log(`f: ${isObjectLiteral(f)}`)
  // console.log(`g: ${isObjectLiteral(g)}`) 

}