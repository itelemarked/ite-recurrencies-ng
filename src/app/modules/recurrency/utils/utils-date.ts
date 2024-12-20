import * as TEMPO from "@formkit/tempo";
import { PeriodUnit } from "../interfaces/PeriodUnit";
import { RecurrencyService } from "../recurrency.service";
import dayjs from "dayjs";
import utc  from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import updateLocale from "dayjs/plugin/updateLocale"
import { BehaviorSubject } from "rxjs";

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
  const d1 = timezoneDate(`2024-06-01 12:12:12.122`) 
  console.log(`milliseconds: ${endOf(d1, 'milliseconds').toISOString() === '2024-06-01T10:12:12.122Z'}`)
  console.log(`seconds: ${endOf(d1, 'seconds').toISOString() === '2024-06-01T10:12:12.999Z'}`)
  console.log(`minutes: ${endOf(d1, 'minutes').toISOString() === '2024-06-01T10:12:59.999Z'}`)
  console.log(`hours: ${endOf(d1, 'hours').toISOString() === '2024-06-01T10:59:59.999Z'}`)
  console.log(`days: ${endOf(d1, 'days').toISOString() === '2024-06-01T21:59:59.999Z'}`)
  console.log(`weeks: ${endOf(d1, 'weeks').toISOString() === '2024-06-02T21:59:59.999Z'}`)
  console.log(`months: ${endOf(d1, 'months').toISOString() === '2024-06-30T21:59:59.999Z'}`)
  console.log(`years: ${endOf(d1, 'years').toISOString() === '2024-12-31T22:59:59.999Z'}`)
  // console.log(`years: ${endOf(d1, 'years').toISOString()}`)
  // console.log(d1.toISOString())

  // const d1 = timezoneDate(`2024-06-01T12:12:12.122`)
}