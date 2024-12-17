import { PeriodUnit } from "../interfaces/PeriodUnit";
import * as TEMPO from "@formkit/tempo";



export function timezoneDate(dateTime: string | Date, timezone: string): Date {
 return TEMPO.tzDate(dateTime, timezone)
}

export function add(date: Date, nb: number, unit: PeriodUnit): Date {
  switch (unit) {
    case 'days': return TEMPO.addDay(date, nb)
    case 'weeks': return TEMPO.addDay(date, nb * 7)
    case 'months': return TEMPO.addMonth(date, nb)
    case 'years': return TEMPO.addYear(date, nb)
  }
}

export function diffDays(date1: Date, date2: Date): number {
  return TEMPO.diffDays(date1, date2)
}

export function format(date: Date | string, formatStyle: TEMPO.Format, locale: string): string {
  return TEMPO.format(date, formatStyle, locale)
}