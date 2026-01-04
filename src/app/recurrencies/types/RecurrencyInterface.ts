import { PeriodUnit } from "@app/_types/PeriodUnit"
import { DateString } from "@app/_types/DateString"
import { TimeString } from "@app/_types/TimeString"
import { Timezone } from "@app/_types/Timezone"
import { TimezoneDateInterface } from "./TimezoneDateInterface"
import { PositiveInteger } from "@app/_types/PositiveInteger"

export interface RecurrencyInterface {
  readonly uid: string,
  title: string,
  lastEvent: TimezoneDateInterface,
  periodNb: PositiveInteger,
  periodUnit: PeriodUnit
  getExpiryDate: () => TimezoneDateInterface,
  // getPeriodLeft: (unit: PeriodUnit) => string,
  setExpiryDate: (dateString: DateString, timeString: TimeString, timezone: Timezone) => void
}