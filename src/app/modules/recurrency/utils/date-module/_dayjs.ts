import dayjs, { ManipulateType } from "dayjs";
import utc  from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { PeriodUnit } from "../../types/PeriodUnit";

dayjs.extend(utc)
dayjs.extend(timezone)

const LOCALE = navigator.language
const LOCALE_OPTIONS = {
  weekStart: 1 // Sets the weekstart to Monday
}
dayjs.locale(LOCALE, LOCALE_OPTIONS)

type DayjsUnit = ManipulateType

export const DAYJS_UNIT: Record<PeriodUnit, DayjsUnit> = {
  'milliseconds': 'milliseconds',
  'seconds': 'seconds',
  'minutes': 'minutes',
  'hours': 'hours',
  'days': 'days',
  'weeks': 'weeks',
  'months': 'months',
  'years': 'years',
}

export const DAYJS = dayjs


