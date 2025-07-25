
export function isNull(val: any): val is null {
  return val === null
}

export function isUndefined(val: any): val is undefined {
  return val === undefined
}
export function isString(val: any): val is string {
  return typeof val === 'string'
}

export function isNumber(val: any): val is number {
  return typeof val === 'number'
}

export function isBoolean(val: any): val is boolean {
  return typeof val === 'boolean'
}

export function isArray(val: any): val is any[] {
  return Array.isArray(val)
}

export function isOptional(val: any): val is any[] {
  return true
}

/**
 * 
 * Use 'isObject' to validate an interface.
 * The second argument is map object, with an array of any built in validators (see above) or any function of type (val: any) => boolean.
 * 
 * How to use:
 * 
 *  type Point = {
 *    x: DateString,
 *    y: number,
 *    z?: string
 *  }
 *
 *  
 *  isObject(p, {
 *    x: [(val: any) => isDateStringForTimezone(val, 'Europe/Zurich')],
 *    y: [isNumber],
 *    z: [isString, isOptional]
 *  })
 */
export function isObject<T extends Record<string, unknown>>(val: any, options?: Record<string, (((...args: any) => boolean))[]>): val is T {
  const isPlainObj = (val: any): val is Record<string, unknown> => val !== null && val !== undefined && Object.getPrototypeOf(val) === Object.prototype
  if(!isPlainObj(val)) return false
  if(options === undefined) return true
  
  return Object.entries(options).every(([prop, fns]) => {

    // no property with isOptional option
    if(!(prop in val) && fns.map(fn => fn.name).includes('isOptional')) {
      return true
    }

    // property exists and is undefined, with isOptional option
    if(prop in val && isUndefined(val[prop])) {
      return true
    }
    
    // Otherwise, property must exist and be valid for every function
    return (prop in val) && fns.every(fn => fn(val[prop]))

  })
}

