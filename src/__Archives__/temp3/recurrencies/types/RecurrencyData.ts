import { DateString } from "./DateString"
import { PeriodUnit } from "./PeriodUnit"
import { PositiveInteger } from "./PosititveInteger"

export type RecurrencyData = {
    title: string
    lastEvent: DateString
    periodNb: PositiveInteger
    periodUnit: PeriodUnit
}