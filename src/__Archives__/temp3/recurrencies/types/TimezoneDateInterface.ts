import { DateFormat } from "src/__Archives__/temp3/_types/DateFormat";
import { DateString } from "src/__Archives__/temp3/_types/DateString";
import { PeriodUnit } from "src/__Archives__/temp3/_types/PeriodUnit";
import { PositiveInteger } from "src/__Archives__/temp3/_types/PositiveInteger";
import { TimeString } from "src/__Archives__/temp3/_types/TimeString";
import { Timezone } from "src/__Archives__/temp3/_types/Timezone";

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