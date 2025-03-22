
export type DateString = string & { _type: 'DateString' }

export function isDateString(val: unknown): val is DateString {
  const isString = (v: unknown): v is string => typeof v === 'string'
  const isRegex = (v: string): boolean =>  /^\d{4}-\d{2}-\d{2}$/.test(v)
  const isValidDate = (v: string): boolean => new Date(v).toString() !== 'Invalid Date'

  return isString(val) && isRegex(val) && isValidDate(val)
}

export function toDateString(val: string): DateString {
  const isRegex = /^\d{4}-\d{2}-\d{2}$/.test(val)
  const isValidDate = new Date(val).toString() !== 'Invalid Date'

  if(!isRegex || !isValidDate) throw new Error(`Custom Type Error: "${val}" cannot be converted into DateString...`)
  return val as DateString
}
