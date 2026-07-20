import { filter } from "../object/object"

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
export const isOptional = (val: any) => false

/**
 * @example
 * 
 *  type Graph = {
 *    xLabel: string, 
 *    yLabel: string, 
 *    origin: {
 *      x: number, 
 *      y: number
 *    },
 *    optionalProp?: string,
 *    optionalPropWhichMayBeUndefined?: string | undefined,
 *    nonOptionalPropWhichMayBeUndefined: string | undefined
 *  }
 * 
 *  function isGraph({
 *    xLabel: [isString],
 *    yLabel: [isString],
 *    origin: [
 *      isInterface({
 *        x: [isNumber],
 *        y: [isNumber]
 *      })
 *    ],
 *    optionalProp: [isOptional, isString]
 *    optionalPropWhichMayBeUndefined: [isOptional, isString, isUndefined]
 *    nonOptionalPropWhichMayBeUndefined: [isString, isUndefined]
 *  })
 * 
 *  const graph1 = {
 *    xLabel: 'time',
 *    yLabel: 'distance',
 *    origin: {
 *      x: 10,
 *      y: 10
 *    },
 *    nonOptionalPropWhichMayBeUndefined: undefined
 *  }
 * 
 *  // RETURS 'true'
 *  isGraph(graph1)
 * 
 * 
 *  const graph2 = {
 *    xLabel: 'time',
 *    yLabel: 'distance',
 *    origin: {
 *      x: 10,
 *      y: 10
 *    }
 *  }
 * 
 *  // RETURS 'false': 'nonOptionalPropWhichMayBeUndefined' missing in graph2
 *  isGraph(graph2)
 * 
 * 
 *  const graph3 = {
 *    xLabel: 'time',
 *    yLabel: 'distance',
 *    origin: {
 *      x: 10,
 *      y: 10
 *    },
 *    optionalProp: 99
 *    nonOptionalPropWhichMayBeUndefined: undefined
 *  }
 * 
 *  // RETURS 'false': 'optionalProp' is has been given with the wrong type!
 *  isGraph(graph2)
 * 
 */

type Condition = ((arg: any) => boolean)
type KeyConditions = Record<string, Condition[]>

export const isInterface = <T extends Record<string, any>>(keyConditions: KeyConditions) => (val: any): val is T => {
  // CHECKS 'val' IS A 'PlainObject'
  if(!isPlainObject(val)) return false

  const requiredKeyConditions = filter(keyConditions, ([_, conditions]) => conditions.every((condition) => condition.name !== 'isOptional'))
  const optionalKeyConditions = filter(keyConditions, ([_, conditions]) => conditions.some((condition) => condition.name === 'isOptional'))

  const valueHasAllRequiredKeys = Object.keys(requiredKeyConditions).every(requiredKey => requiredKey in val)
  if(!valueHasAllRequiredKeys) return false

  const valueRequiredKeysHaveRightType = Object.entries(requiredKeyConditions)
    .every(([key, conditions]) => conditions.some(condition => condition(val[key])))
  if(!valueRequiredKeysHaveRightType) return false

  const valueOptionalKeysHaveRightType = Object.entries(optionalKeyConditions)
    .every(([key, conditions]) => {
      if(val[key] === undefined) return true
      return conditions.some(condition => condition(val[key]))
    })
  if(!valueOptionalKeysHaveRightType) return false

  return true
}