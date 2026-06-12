export const RECURRENCY_ERROR = {
  fetch_data_wrong_type: 'fetch-data-wrong-type'
} as const

export type RecurrencyError = typeof RECURRENCY_ERROR[keyof typeof RECURRENCY_ERROR]