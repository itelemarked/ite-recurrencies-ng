export type DateString = string & { _type: 'DateString' }

export function isDateString(val: any): val is DateString {
  const isDateStringRegex = /^\d{4}-\d{2}-\d{2}$/.test(val)
  const isValidDate = new Date(val).toString() !== 'Invalid Date'

  return isDateStringRegex && isValidDate
}