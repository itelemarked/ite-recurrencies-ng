import dayjs, { ManipulateType } from "dayjs";
import utc  from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

import { DateFormat } from "@app/_types/DateFormat";
import { Timezone } from "@app/_types/Timezone";
import { PositiveInteger } from "@app/_types/PositiveInteger";
import { PeriodUnit } from "@app/_types/PeriodUnit";



// ----------  INIT DAYJS  ----------------------
dayjs.extend(utc)
dayjs.extend(timezone)

const LOCALE = navigator.language
const LOCALE_OPTIONS = {
  weekStart: 1 // Sets the weekstart to Monday
}
dayjs.locale(LOCALE, LOCALE_OPTIONS)
// ----------------------------------------------


export function format(d: Date, format: DateFormat, timezone: Timezone) {
  switch(format) {
    case 'CH': {
      return dayjs(d).tz(timezone).format('DD.MM.YY')
    }
    case 'US': {
      return dayjs(d).tz(timezone).format('MM/DD/YY')
    }
    case 'ISO': {
      return dayjs(d).tz(timezone).format('YYYY-MM-DDTHH:mm:ss.SSSZZ')
    }
    case 'PLATFORM_DEFINED': {
      return dayjs(d).tz(timezone).toDate().toLocaleDateString()
    }
  }
}

export function getPlatformTimezone() {
  return dayjs.tz.guess()
}

export function add(date: Date, nb: PositiveInteger, unit: PeriodUnit): Date {
  return dayjs(date).add(nb, unit).toDate()
}

export function substract(date: Date, nb: PositiveInteger, unit: PeriodUnit): Date {
  return dayjs(date).subtract(nb, unit).toDate()
}

export function endOf(date: Date, unit: PeriodUnit, timezone: Timezone): Date {
  // make sure dayjs is configurated to have week start setted to Monday!
  return dayjs(date).tz(timezone).endOf(unit).toDate()
}

// TODO: returns Integer instead of number??
export function diff(date1: Date, date2: Date, unit: PeriodUnit): number {
  // Takes the floor of decimal values. Eg: 1.1 returns 1, as well as 1.9 returns 1!!!
  return dayjs(date1).diff(date2, unit)
}




// export function createTimezoneDate({ dateString, timeString , timezone }: { dateString: DateString, timeString: TimeString, timezone: TimezoneString }): Date {  
//   const dateStr = dateString
//   const timeStr = timeString ?? '00:00:00.000'
//   const timezoneStr = timezone ?? 'UTC'

//   const dateTime = `${dateStr}T${timeStr}`
//   return dayjs(dateTime).tz(timezoneStr, true).toDate()
// }

// export function format(date: Date, format: DateFormatOptions, timezone: TimezoneString): string {
//   switch(format) {
//     case 'DD.MM.YYYY':
//       return dayjs(date).tz(timezone).format('DD.MM.YYYY')
//     case 'UTC':
//     case 'DD.MM.YY HH:mm:ss.SSS TIMEZONE':
//       return dayjs(date).tz(timezone).format(`DD.MM.YY HH:mm:ss.SSS [${timezone}]`)
//     case 'YYYY-MM-DD':
//       return dayjs(date).tz(timezone).format(`YYYY-MM-DD`)
//   }
// }

// function convertToDayjsPeriodUnit(unit: PeriodUnit): ManipulateType {
//   const DAYJS_UNIT: Record<PeriodUnit, ManipulateType> = {
//     'milliseconds': 'milliseconds',
//     'seconds': 'seconds',
//     'minutes': 'minutes',
//     'hours': 'hours',
//     'days': 'days',
//     'weeks': 'weeks',
//     'months': 'months',
//     'years': 'years',
//   }
//   return DAYJS_UNIT[unit]
// }