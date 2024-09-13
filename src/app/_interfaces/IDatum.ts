import { PeriodUnit } from "../_types/PeriodUnit";

export interface IDatum {
  /**
   * 
   * @param opts 
   * Optional format: the date should be formatted to.
   * Optional offset: in which timezone offset the date should be converted to.
   */
  toString(opts?: {format?: string, offset?: string}): string,

  /**
   * @returns the number in milliseconds from 1970-01-01
   */
  valueOf(): number,

  /**
   * 
   * @param nb 
   * @param unit 
   */
  add(nb: number, unit: PeriodUnit): IDatum,

  /**
   * clone a IDatum. Often used for immutability.
   */
  clone(): IDatum,
}