export const isString = (val: any): val is string => typeof val === 'string'

export const isNumber = (val: any): val is number => typeof val === 'number'

export const isBoolean = (val: any): val is boolean => typeof val === 'boolean'

export const isNull = (val: any): val is null => val === null

export const isUndefined = (val: any): val is undefined => val === undefined

export const isValidDate = (val: any): val is Date => val instanceof Date && new Date(val).toString() !== 'Invalid Date'

export const isArray = <T>(val: any): val is T[] => Array.isArray(val)

// TODO: type of generic function???
export const isFunction = <T extends Function>(val: any): val is T => typeof val === 'function'

/**
 * Each single property must be still checked one by one...
 * E.g:
 * type MyType = { title: string, value: number }
 * 
 * const isMyType = (val: any): val is MyType => isPlainObject(val) && isString(val.title) && isNumber(val.value)
 */
export const isPlainObject = <T extends object>(val: any): val is T => val !== null && val !== undefined && Object.getPrototypeOf(val) === Object.prototype
