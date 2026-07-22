
const STORE_ERRORS_KNOWN = {
  'invalid-data': 'The retreived data is invalid'
}

type StoreErrorCodeKnown = keyof typeof STORE_ERRORS_KNOWN
type StoreErrorCodeUnknown = 'unknown-store-error'
type StoreErrorCode = StoreErrorCodeKnown | StoreErrorCodeUnknown
const isStoreErrorCodeKnown = (code: StoreErrorCode): code is StoreErrorCodeKnown => code in STORE_ERRORS_KNOWN

/**
 * Extends 'Error' object.
 * - Additional: code property.
 * - Additional information: should be put in the regular 'options/cause' of the 'Error' object.
 */
export class StoreError extends Error {
  code: StoreErrorCode

  constructor(code: StoreErrorCodeKnown, options?: any)
  constructor(code: StoreErrorCodeUnknown, detail: string, options?: any)
  constructor(code: StoreErrorCode, detail?: string, options?: any) {
    const message = isStoreErrorCodeKnown(code) ? STORE_ERRORS_KNOWN[code] : `Unknown store error: ${detail}`
    super(message, options)
    this.code = code
    this.name = 'StoreError'
  }
}