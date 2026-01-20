import { isPlainObject } from "../valid-type"

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

// export function set(o: Record<string, any>, path: string, value: any): Record<string, any> {
//   const copyObject = deepCopy(o)
// }

// export function update(o: Record<string, any>, path: string, value: any): Record<string, any> {
//   const copyObject = deepCopy(o)
// }

// export function remove(o: Record<string, any>, path: string): Record<string, any> {
//   const copyObject = deepCopy(o)
// }
