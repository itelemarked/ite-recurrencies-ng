
export type TimeString = string & {_type: 'TimeString'}

export function toTimeString(val: string): TimeString {
  // HH:mm:ss.sss
  const isRegex = /^(?:[0-1][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9].\d{3}$/.test(val)
  if(!isRegex) throw new Error(`Custom Type Error: "${val}" cannot be converted into TimeString... (HH:mm:ss.SSS)`)
  return val as TimeString
}