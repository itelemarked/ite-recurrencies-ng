import { PeriodUnit } from "../interfaces/PeriodUnit";
import * as TEMPO from "@formkit/tempo";



export function timezoneDate(dateTime: string | Date, timezone: string): Date {
 return TEMPO.tzDate(dateTime, timezone)
}

export function add(date: Date, nb: number, unit: PeriodUnit = 'milliseconds'): Date {
  switch (unit) {
    case 'milliseconds': return new Date(date.valueOf() + nb)
    case 'seconds': return TEMPO.addSecond(date, nb)
    case 'minutes': return TEMPO.addMinute(date, nb)
    case 'hours': return TEMPO.addHour(date, nb)
    case 'days': return TEMPO.addDay(date, nb)
    case 'weeks': return TEMPO.addDay(date, nb * 7)
    case 'months': return TEMPO.addMonth(date, nb)
    case 'years': return TEMPO.addYear(date, nb)
  }
}

export function endOf(date: Date, unit: PeriodUnit = 'milliseconds'): Date {
  switch(unit) {
    case 'milliseconds': {
      const dateCopy = new Date(date)
      const newMilliseconds = dateCopy.getUTCMilliseconds() + 1
      return new Date(dateCopy.setMilliseconds(newMilliseconds))
    }
    case 'seconds': {
      const dateCopy = new Date(date)
      const newSecond = dateCopy.getUTCSeconds() + 1
      return new Date(dateCopy.setSeconds(newSecond, 0))
    }
    case 'minutes': return TEMPO.minuteEnd(date)
    case 'hours': return TEMPO.hourEnd(date)
    case 'days': return TEMPO.dayEnd(date)
    case 'weeks': return TEMPO.weekEnd(date)
    case 'months': return TEMPO.monthEnd(date)
    case 'years': return TEMPO.yearEnd(date)
  }
}

type DiffRoundingMethod = "trunc" | "round" | "floor" | "ceil"

export function diff(date1: Date, date2: Date, unit: PeriodUnit = 'milliseconds', roundingMethod: DiffRoundingMethod = 'trunc'): number {
  switch (unit) {
    case 'milliseconds': return TEMPO.diffMilliseconds(date1, date2)
    case 'seconds': return TEMPO.diffSeconds(date1, date2, roundingMethod)
    case 'minutes': return TEMPO.diffMinutes(date1, date2, roundingMethod)
    case 'hours': return TEMPO.diffHours(date1, date2, roundingMethod)
    case 'days': return TEMPO.diffDays(date1, date2, roundingMethod)
    case 'weeks': return TEMPO.diffWeeks(date1, date2, roundingMethod)
    case 'months': return TEMPO.diffMonths(date1, date2)
    case 'years': return TEMPO.diffYears(date1, date2)
  }
}

export function format(date: Date | string, formatStyle: TEMPO.Format, locale: string): string {
  return TEMPO.format(date, formatStyle, locale)
}