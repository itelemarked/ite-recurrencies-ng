import { PeriodUnit } from "../../types/PeriodUnit.type"

import { DateString } from "./DateString"
import { TimeString, toTimeString } from "./TimeString"
import { TimezoneString, toTimezoneString } from "./TimezoneString"

import { DAYJS, DAYJS_UNIT } from "./_dayjs"


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


export function add(date: Date, nb: number, unit: PeriodUnit): Date {
  return DAYJS(date).add(nb, DAYJS_UNIT[unit]).toDate()
}

export function endOf(date: Date, unit: PeriodUnit, timezone: TimezoneString): Date {
  return DAYJS(date).tz(timezone).endOf(DAYJS_UNIT[unit]).toDate()
}