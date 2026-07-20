import { isPlainObject } from "../../js/types/valid-type"

export type Identifiable<T extends Record<string, any>> = T & { uid: string }

export function isIdentifiable(val: any): val is {uid: string} {
  return isPlainObject(val) && 'uid' in val && typeof val['uid'] === 'string'
}
