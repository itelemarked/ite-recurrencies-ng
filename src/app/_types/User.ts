import { isInterface, isString } from "@app/_utils/type-validation"

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