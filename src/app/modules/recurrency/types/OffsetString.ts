
export type OffsetString = string & {_type: 'OffsetString'}

export function toOffsetString(val: string): OffsetString {
  // from -12:00 (included) to +12:00 (included)
  const isRegex = /^(?:[+-])(?:(?:(?:0[0-9]|1[0-1]):(?:[0-5][0-9]))|12:00)$/.test(val)

  if(!isRegex) throw new Error(`Custom Type Error: "${val}" cannot be converted into PositiveInteger...`)
  return val as OffsetString
}