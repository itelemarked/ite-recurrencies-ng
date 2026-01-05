import { PeriodUnit } from "src/__Archives__/temp3/_types/PeriodUnit"
import { DateString } from "src/__Archives__/temp3/_types/DateString"
import { TimeString } from "src/__Archives__/temp3/_types/TimeString"
import { Timezone } from "src/__Archives__/temp3/_types/Timezone"
import { TimezoneDateInterface } from "./TimezoneDateInterface"
import { PositiveInteger } from "src/__Archives__/temp3/_types/PositiveInteger"

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