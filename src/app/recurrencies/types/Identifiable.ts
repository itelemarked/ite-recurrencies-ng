import { isPlainObject } from "../../../js/valid-type"


export type Identifiable<T extends object> = T & { uid: string }

export function isIdentifiable(val: any): val is {uid: string} {
  return isPlainObject(val) && 'uid' in val && typeof val['uid'] === 'string'
}