import { PeriodUnit } from "src/__Archives__/temp3/_types/PeriodUnit";
import { RecurrencyInterface } from "../types/RecurrencyInterface";
import { TimezoneDateInterface } from "../types/TimezoneDateInterface";
import { PositiveInteger } from "src/__Archives__/temp3/_types/PositiveInteger";
import { DateString } from "src/__Archives__/temp3/_types/DateString";
import { TimeString } from "src/__Archives__/temp3/_types/TimeString";
import { Timezone } from "src/__Archives__/temp3/_types/Timezone";
import { TimezoneDate } from "./TimezoneDate.model";

export class Recurrency implements RecurrencyInterface {

  readonly uid: string
  title: string
  lastEvent: TimezoneDateInterface
  periodNb: PositiveInteger
  periodUnit: PeriodUnit

  constructor(uid: string, title: string, lastEvent: TimezoneDateInterface, periodNb: PositiveInteger, periodUnit: PeriodUnit) {
    this.uid = uid
    this.title = title
    this.lastEvent = lastEvent
    this.periodNb = periodNb
    this.periodUnit = periodUnit
  }

  getExpiryDate() {
    return this.lastEvent.add(this.periodNb, this.periodUnit)
  }

  // getPeriodLeft(unit: PeriodUnit) {
  //   const periodLeft = this.getExpiryDate().diff(unit)
  //   return periodLeft < 0 ?
  //   `expired...` :
  //   periodLeft > 1 ? 
  //   `${periodLeft} ${unit} left...` : 
  //   `${periodLeft} ${unit} left...`
  // }

  setExpiryDate(dateString: DateString, timeString: TimeString, timezone: Timezone) {
    this.lastEvent = new TimezoneDate(dateString, timeString, timezone).subtract(this.periodNb, this.periodUnit)
  }

}