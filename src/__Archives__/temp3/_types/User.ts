import { isInterface, isString } from "src/__Archives__/temp3/_utils/type-validation"

export type User = {
  uid: string,
  email: string
}

export function isUser(val: any): val is User {
  return isInterface({
    uid: [isString],
    email: [isString]
  })(val)
}