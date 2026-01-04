import { DateString } from "./DateString"
import { PeriodUnit } from "./PeriodUnit"
import { PositiveInteger } from "./PositiveInteger"

export type Recurrency = {
  title: string,
  lastEvent: DateString,
  periodNb: PositiveInteger,
  periodUnit: PeriodUnit,
  category: string
}