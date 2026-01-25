import { Integer } from "./Integer"
import { PeriodUnit } from "./PeriodUnit"
import { PositiveInteger } from "./PosititveInteger"
import { RecurrencyData } from "./RecurrencyData"
import { TimezoneDateInterface } from "./TimezoneDateInterface"

export type Recurrency = {
    uid: string
    title: string
    lastEventDate: TimezoneDateInterface
    periodNb: PositiveInteger
    periodUnit: PeriodUnit
    getExpiryDate: () => TimezoneDateInterface
    getDiffFromNow: () => Integer
    toData: () => RecurrencyData
}