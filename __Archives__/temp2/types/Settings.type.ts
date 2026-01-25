import { DateFormat } from "./DateFormat.enum"
import { Timezone } from "./Timezone.enum"

export type Settings = {
  timezone: Timezone,
  dateFormat: DateFormat
}