import dayjs, { ManipulateType } from "dayjs";
import utc  from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { DateFormat } from "../types/DateFormat.enum";
import { Timezone } from "../types/Timezone.enum";

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
    case DateFormat.CH: {
      return dayjs(d).tz(timezone).format('DD.MM.YY')
    }
    case DateFormat.US: {
      return dayjs(d).tz(timezone).format('MM/DD/YY')
    }
    case DateFormat.ISO: {
      return dayjs(d).tz(timezone).format('YYYY-MM-DDTHH:mm:ss.SSSZZ')
    }
    case DateFormat.PLATFORM_DEFINED: {
      return dayjs(d).tz(timezone).toDate().toLocaleDateString()
    }
  }
}

export function getPlatformTimezone() {
  return dayjs.tz.guess()
}



// export function createTimezoneDate({ dateString, timeString = TIME , timezone = TIMEZONE }: { dateString: DateString, timeString?: TimeString, timezone?: TimezoneString }): Date {  
//   const dateStr = dateString
//   const timeStr = timeString ?? '00:00:00.000'
//   const timezoneStr = timezone ?? 'UTC'

//   const dateTime = `${dateStr}T${timeStr}`
//   return dayjs(dateTime).tz(timezoneStr, true).toDate()
// }

// export function add(date: Date, nb: Integer, unit: PeriodUnit): Date {
//   return dayjs(date).add(nb, convertToDayjsPeriodUnit(unit)).toDate()
// }

// export function endOf(date: Date, unit: PeriodUnit, timezone: TimezoneString): Date {
//   // make sure dayjs is configurated to have week start setted to Monday!
//   return dayjs(date).tz(timezone).endOf(convertToDayjsPeriodUnit(unit)).toDate()
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