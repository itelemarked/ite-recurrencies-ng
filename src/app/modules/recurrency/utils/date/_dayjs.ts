import dayjs, { ManipulateType } from "dayjs";
import utc  from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { PeriodUnit } from "../../types/PeriodUnit.type";

dayjs.extend(utc)
dayjs.extend(timezone)

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

