import { DATE_FORMAT, DateFormat } from "./DateFormat";
import { DateString } from "./DateString";
import { PeriodUnit } from "./PeriodUnit";
import { PositiveInteger } from "./PositiveInteger";
import { TimeString } from "./TimeString";
import { Timezone } from "./Timezone";

export interface TimezoneDateInterface {
  dateString: (opts?: {timezone: Timezone}) => DateString,
  timeString: (opts?: {timezone: Timezone}) => TimeString,
  timezone: () => Timezone,
  dateFormat: () => DateFormat,
  date: () => Date,
  diff: (unit: PeriodUnit, opts?: {timezoneDate?: TimezoneDateInterface, floored?: boolean}) => number
  toString: (opts?: {timezone?: Timezone, dateFormat?: DateFormat}) => string

  update: (opts: {
      dateString?: DateString, 
      timeString?: TimeString, 
      timezone?: Timezone, 
      dateFormat?: DateFormat
    }) => TimezoneDateInterface
  add: (nb: PositiveInteger, unit: PeriodUnit, opts?: {timezone?: Timezone, dateFormat?: DateFormat}) => TimezoneDateInterface
  subtract: (nb: PositiveInteger, unit: PeriodUnit, opts?: {timezone?: Timezone, dateFormat?: DateFormat}) => TimezoneDateInterface
  endOf: (unit: PeriodUnit, opts?: {timezone?: Timezone, dateFormat?: DateFormat}) => TimezoneDateInterface
}
