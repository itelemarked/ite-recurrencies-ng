import dayjs, { ManipulateType } from "dayjs";
import utc  from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

import { PeriodUnit } from "../../types/PeriodUnit"
import { Integer } from "../../types/Integer"
import { DateString } from "../../types/DateString"
import { DateFormatOptions } from "../../types/DateFormatOptions"
import { TimeString, toTimeString } from "../../types/TimeString"
import { TimezoneString } from "../../types/TimezoneString"

// ----------  INIT DAYJS  ----------------------
dayjs.extend(utc)
dayjs.extend(timezone)

const LOCALE = navigator.language
const LOCALE_OPTIONS = {
  weekStart: 1 // Sets the weekstart to Monday
}
dayjs.locale(LOCALE, LOCALE_OPTIONS)
// ----------------------------------------------



export const DAYJS_UNIT: Record<PeriodUnit, ManipulateType> = {
  'milliseconds': 'milliseconds',
  'seconds': 'seconds',
  'minutes': 'minutes',
  'hours': 'hours',
  'days': 'days',
  'weeks': 'weeks',
  'months': 'months',
  'years': 'years',
}

const TIME = toTimeString('00:00')
const TIMEZONE = 'UTC'

export function createTimezoneDate({ dateString, timeString = TIME , timezone = TIMEZONE }: { dateString: DateString, timeString?: TimeString, timezone?: TimezoneString }): Date {  
  const dateStr = dateString
  const timeStr = timeString ?? '00:00:00.000'
  const timezoneStr = timezone ?? 'UTC'

  const dateTime = `${dateStr}T${timeStr}`
  return dayjs(dateTime).tz(timezoneStr, true).toDate()
}

export function add(date: Date, nb: Integer, unit: PeriodUnit): Date {
  return dayjs(date).add(nb, convertToDayjsPeriodUnit(unit)).toDate()
}

export function endOf(date: Date, unit: PeriodUnit, timezone: TimezoneString): Date {
  // make sure dayjs is configurated to have week start setted to Monday!
  return dayjs(date).tz(timezone).endOf(convertToDayjsPeriodUnit(unit)).toDate()
}

export function format(date: Date, format: DateFormatOptions, timezone: TimezoneString): string {
  switch(format) {
    case 'DD.MM.YYYY':
      return dayjs(date).tz(timezone).format('DD.MM.YYYY')
    case 'UTC':
    case 'DD.MM.YY HH:mm:ss.SSS TIMEZONE':
      return dayjs(date).tz(timezone).format(`DD.MM.YY HH:mm:ss.SSS [${timezone}]`)
  }
}

function convertToDayjsPeriodUnit(unit: PeriodUnit): ManipulateType {
  const DAYJS_UNIT: Record<PeriodUnit, ManipulateType> = {
    'milliseconds': 'milliseconds',
    'seconds': 'seconds',
    'minutes': 'minutes',
    'hours': 'hours',
    'days': 'days',
    'weeks': 'weeks',
    'months': 'months',
    'years': 'years',
  }
  return DAYJS_UNIT[unit]
}
