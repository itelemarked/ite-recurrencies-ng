export type TimeString = string & {_type: 'TimeString'}

export function isTimeString(val: string): val is TimeString {
  // HH:mm:ss.sss
  const isRegex = /^(?:[0-1][0-9]|2[0-3]):[0-5][0-9](?::[0-5][0-9](?:.\d{3})?)?$/.test(val)
  return isRegex
}