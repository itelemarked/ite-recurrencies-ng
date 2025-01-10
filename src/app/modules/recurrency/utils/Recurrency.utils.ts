import { Recurrency } from "../types/Recurrency.type";
import { add } from "./Date.utils";


export function lastEvent(recurrency: Recurrency) {
  return recurrency.lastEvent
}

export function expiry(recurrency: Recurrency) {
  const { lastEvent, periodNb, periodUnit } = recurrency
  const addedPeriod = add(lastEvent, periodNb, periodUnit)
  // return add(addedPeriod, 1, 'milliseconds')
  return addedPeriod
}