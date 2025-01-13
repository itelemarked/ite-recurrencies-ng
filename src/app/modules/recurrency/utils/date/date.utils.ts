import { PeriodUnit } from "../../types/PeriodUnit.type"
import { Integer } from "../../types/Integer.type"

import { DateString } from "./DateString"
import { TimeString, toTimeString } from "./TimeString"
import { TimezoneString, toTimezoneString } from "./TimezoneString"

import { DAYJS, DAYJS_UNIT } from "./_dayjs"
import { DateFormat } from "./DateFormat"


type TimezoneDate = {
  dateString: DateString,
  timeString?: TimeString,
  timezone?: TimezoneString
}

const TIME = toTimeString('00:00')
const TIMEZONE = toTimezoneString('Europe/Zurich')

export function createTimezoneDate({ dateString, timeString = TIME , timezone = TIMEZONE }: TimezoneDate): Date {  
  const dateTime = `${dateString}T${timeString}`
  return DAYJS(dateTime).tz(timezone, true).toDate()
}

export function add(date: Date, nb: Integer, unit: PeriodUnit): Date {
  return DAYJS(date).add(nb, DAYJS_UNIT[unit]).toDate()
}

export function endOf(date: Date, unit: PeriodUnit, timezone: TimezoneString): Date {
  // make sure dayjs is configurated to have week start setted to Monday!
  return DAYJS(date).tz(timezone).endOf(DAYJS_UNIT[unit]).toDate()
}

export function format(date: Date, format: DateFormat, timezone: TimezoneString): string {
  switch(format) {
    case 'DD.MM.YYYY':
      return DAYJS(date).tz(timezone).format('DD.MM.YYYY')
    case 'UTC':
    case 'DD.MM.YY HH:mm:ss.SSS TIMEZONE':
      return DAYJS(date).tz(timezone).format(`DD.MM.YY HH:mm:ss.SSS [${timezone}]`)
  }
}