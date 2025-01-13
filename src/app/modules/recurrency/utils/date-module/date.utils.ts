import dayjs, { ManipulateType } from "dayjs";
import utc  from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

import { PeriodUnit } from "../../types/PeriodUnit"
import { Integer } from "../../types/Integer"
import { DateString } from "../../types/DateString"
import { DateFormat } from "../../types/DateFormat"
import { TimeString, toTimeString } from "../../types/TimeString"
import { TimezoneString } from "../../types/TimezoneString"

dayjs.extend(utc)
dayjs.extend(timezone)

const LOCALE = navigator.language
const LOCALE_OPTIONS = {
  weekStart: 1 // Sets the weekstart to Monday
}
dayjs.locale(LOCALE, LOCALE_OPTIONS)



type DayjsUnit = ManipulateType

export const DAYJS_UNIT: Record<PeriodUnit, DayjsUnit> = {
  'milliseconds': 'milliseconds',
  'seconds': 'seconds',
  'minutes': 'minutes',
  'hours': 'hours',
  'days': 'days',
  'weeks': 'weeks',
  'months': 'months',
  'years': 'years',
}


type TimezoneDate = {
  dateString: DateString,
  timeString?: TimeString,
  timezone?: TimezoneString
}

const TIME = toTimeString('00:00')
const TIMEZONE = 'UTC'

export function createTimezoneDate({ dateString, timeString = TIME , timezone = TIMEZONE }: TimezoneDate): Date {  
  const dateTime = `${dateString}T${timeString}`
  return dayjs(dateTime).tz(timezone, true).toDate()
}

export function add(date: Date, nb: Integer, unit: PeriodUnit): Date {
  return dayjs(date).add(nb, DAYJS_UNIT[unit]).toDate()
}

export function endOf(date: Date, unit: PeriodUnit, timezone: TimezoneString): Date {
  // make sure dayjs is configurated to have week start setted to Monday!
  return dayjs(date).tz(timezone).endOf(DAYJS_UNIT[unit]).toDate()
}

export function format(date: Date, format: DateFormat, timezone: TimezoneString): string {
  switch(format) {
    case 'DD.MM.YYYY':
      return dayjs(date).tz(timezone).format('DD.MM.YYYY')
    case 'UTC':
    case 'DD.MM.YY HH:mm:ss.SSS TIMEZONE':
      return dayjs(date).tz(timezone).format(`DD.MM.YY HH:mm:ss.SSS [${timezone}]`)
  }
}


