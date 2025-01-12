
export type DateString = string & {_type: 'DateString'}

export function toDateString(val: string): DateString {
  const isRegex = /^\d{4}-\d{2}-\d{2}$/.test(val)
  const isValidDate = new Date(val).toString() !== 'Invalid Date'

  if(!isRegex || !isValidDate) throw new Error(`Custom Type Error: "${val}" cannot be converted into DateString...`)
  return val as DateString
}