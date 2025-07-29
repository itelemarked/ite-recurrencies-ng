
export const isUndefined = (val: any): val is undefined => val === undefined

export const isNull = (val: any): val is null => val === null

export const isString = (val: any): val is string => typeof val === 'string'

export const isNumber = (val: any): val is number => typeof val === 'number'

export const isBoolean = (val: any): val is boolean => typeof val === 'boolean'

export const isArray = <T>(val: any): val is T[] => Array.isArray(val)

export const isPlainObject = (val: any): val is Record<string, any> => val !== null && val !== undefined && Object.getPrototypeOf(val) === Object.prototype

export const isFunction = (val: any): val is ((...args: any) => any) => typeof val === 'function'



/**
 * THE ONLY PURPOSE OF 'isOpional' IS TO BE PASSED AS 'fns' ARGUMENT TO THE 'isInterface()' FUNCTION.
 * IT IS NO USE TO USE IT AS IS. 
 */
export const isOptional = (val: any) => true

/**
 * Example of use:
 * 
 * Given the following interface 'Graph' and a 'graph1' variable: 
 * 
 *  type Graph = {
 *    xLabel: string, 
 *    yLabel: string, 
 *    origin: {
 *      x: number, 
 *      y: number
 *    },
 *    description?: string
 *  }
 * 
 *  const graph1 = {
 *    xLabel: 'time',
 *    yLabel: 'distance',
 *    origin: {
 *      x: 10,
 *      y: 10
 *    }
 *  }
 * 
 *  const interfaceGraph = {
 *    xLabel: [isString],
 *    yLabel: [isString],
 *    origin: [
 *      isInterface({
 *        x: [isNumber],
 *        y: [isNumber]
 *      })
 *    ],
 *    description: [isString, isOptional]
 *  }
 * 
 *  console.log(isInterface<Graph>(interfaceGraph)(graph1))
 */
export const isInterface = <T extends Record<string, any>>(fns: Record<string, ((arg: any) => boolean)[]>) => (val: any): val is T => {
  // CHECKS 'val' IS A 'PlainObject'
  if(!isPlainObject(val)) return false

  // CHECKS 'VAL' HAS ALL REQUIRED KEYS
  const optionalKeys = Object.entries(fns).filter(([key, values]) => values.map(v => v.name).includes('isOptional')).map(([key, values]) => key)
  const requiredKeys = Object.keys(fns).filter(key => !optionalKeys.includes(key))
  if(!requiredKeys.every(requiredKey => Object.keys(val).includes(requiredKey))) return false
  
  // CHECKS EVERY PROPS OF 'val' FULLFILLS THE REQUIRED CONDITIONS ('isOptional' IS REMOVED FROM THE REQUIRED CONDITIONS LIST)
  return Object.entries(val).every(([key, value]) => fns[key].filter(fn => fn.name !== 'isOptional').some(fn => fn(value)))
}

