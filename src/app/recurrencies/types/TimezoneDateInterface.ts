import { DateFormat } from "@app/_types/DateFormat";
import { DateString } from "@app/_types/DateString";
import { PeriodUnit } from "@app/_types/PeriodUnit";
import { PositiveInteger } from "@app/_types/PositiveInteger";
import { TimeString } from "@app/_types/TimeString";
import { Timezone } from "@app/_types/Timezone";

export interface TimezoneDateInterface {
  readonly dateString: DateString
  readonly timeString: TimeString
  readonly timezone: Timezone
  toString: (format: DateFormat) => string
  toDate: () => Date
  add: (nb: PositiveInteger, unit: PeriodUnit) => TimezoneDateInterface
  subtract: (nb: PositiveInteger, unit: PeriodUnit) => TimezoneDateInterface
  diff: (unit: PeriodUnit, d2?: TimezoneDateInterface) => number
}