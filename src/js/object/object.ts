import { isPlainObject } from "../types/valid-type"

export function deepCopy<T>(o: T): T {
  return JSON.parse(JSON.stringify(o))
}

export function get(o: Record<string, any>, path?: string): any | null {
  if(path === undefined) return deepCopy(o)
  return path.split('/').reduce((acc, el) => {
      if(acc === null) return null
      if(!isPlainObject(acc)) return null
      return acc[el] === undefined ? null : {...acc[el]}
  }, o)
}

export function filter<TValue>(
  o: Record<string, TValue>, 
  filterFn: ([key, value]: [string, TValue]) => boolean
): Record<string, TValue> {
  return Object.entries(o).reduce( (acc, [key, value]) => {
    if(filterFn([key, value])) {
      return {...acc, [key]: value}
    }
    return acc
  }, {})
}

