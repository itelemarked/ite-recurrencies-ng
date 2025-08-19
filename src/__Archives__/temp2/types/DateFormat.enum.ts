
export enum DateFormat {
  PLATFORM_DEFINED = 'platform-defined',
  CH = 'ch',
  US = 'us',
  ISO = 'iso'
}


export function isDateFormat(val: any): val is DateFormat {
  try {
    return Object.values(DateFormat).includes(val as DateFormat);
  } catch {
    return false
  }
}