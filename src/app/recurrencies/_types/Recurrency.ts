import { isInterface, isString } from "@app/_utils/validation/validation"

import { DateString, isDateString } from "./DateString"
import { isPeriodUnit, PeriodUnit } from "./PeriodUnit"
import { isPositiveInteger, PositiveInteger } from "./PositiveInteger"



// type ValidDate = Date & { _type: 'ValidDate' }

// function isValidDate(val: any): val is ValidDate {
//   try {
//     const date = new Date(val)
//     return date.toString() !== 'Invalid Date'
//   } catch {
//     return false
//   }
// }






export type Recurrency = {
  uid: string,
  title: string,
  lastEvent: DateString,
  periodNb: PositiveInteger,
  periodUnit: PeriodUnit
}

export function isRecurrency(val: any): val is Recurrency {
  return isInterface({
    uid: [isString],
    title: [isString],
    lastEvent: [isDateString],
    periodNb: [isPositiveInteger],
    periodUnit: [isPeriodUnit]
  })(val)
}

