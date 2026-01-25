
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


// WITH AS CONST INSTEAD OF ENUM

// export const DATE_FORMAT = {
//   PLATFORM_DEFINED: 'platform-defined',
//   CH: 'ch',
//   US: 'us',
//   ISO: 'iso'
// } as const

// export type DateFormat = typeof DATE_FORMAT

// export function isDateFormat(val: any): val is DateFormat {
//   return Object.values(DATE_FORMAT).includes(val)
// }