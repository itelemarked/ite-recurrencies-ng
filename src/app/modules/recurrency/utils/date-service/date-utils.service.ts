import { Injectable } from "@angular/core";

import dayjs, { ManipulateType } from "dayjs";
import utc  from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

import { PeriodUnit } from "../../types/PeriodUnit";
import { DateString } from "../../types/DateString";
import { TimeString } from "../../types/TimeString";
import { TimezoneString } from "../../types/TimezoneString";
import { Integer } from "../../types/Integer";
import { DateFormat } from "../../types/DateFormat";

import { IDateUtils } from "./date-utils.interfaces";

@Injectable({providedIn: 'root'})
export class DateUtils implements IDateUtils {

  constructor() {
    this.initDayjs()
  }
  
  createTimezoneDate({ dateString, timeString, timezone }: { dateString: DateString, timeString?: TimeString, timezone?: TimezoneString }): Date {  
    const dateStr = dateString
    const timeStr = timeString ?? '00:00:00.000'
    const timezoneStr = timezone ?? 'UTC'

    const dateTime = `${dateStr}T${timeStr}`
    return dayjs(dateTime).tz(timezoneStr, true).toDate()
  }

  add(date: Date, nb: Integer, unit: PeriodUnit): Date {
    const dayjsUnit = this.convertToDayjsPeriodUnit(unit)
    return dayjs(date).add(nb, dayjsUnit).toDate()
  }

  endOf(date: Date, unit: PeriodUnit, timezone: TimezoneString): Date {
    // make sure dayjs is configurated to have week start setted to Monday!
    const dayjsUnit = this.convertToDayjsPeriodUnit(unit)
    return dayjs(date).tz(timezone).endOf(dayjsUnit).toDate()
  }

  format(date: Date, format: DateFormat, timezone: TimezoneString): string {
    switch(format) {
      case 'DD.MM.YYYY':
        return dayjs(date).tz(timezone).format('DD.MM.YYYY')
      case 'UTC':
      case 'DD.MM.YY HH:mm:ss.SSS TIMEZONE':
        return dayjs(date).tz(timezone).format(`DD.MM.YY HH:mm:ss.SSS [${timezone}]`)
    }
  }

  private initDayjs() {
    dayjs.extend(utc)
    dayjs.extend(timezone)
  
    const LOCALE = navigator.language
    const LOCALE_OPTIONS = {
      weekStart: 1 // Sets the weekstart to Monday
    }
    dayjs.locale(LOCALE, LOCALE_OPTIONS)
  }

  private convertToDayjsPeriodUnit(unit: PeriodUnit): ManipulateType {
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

}