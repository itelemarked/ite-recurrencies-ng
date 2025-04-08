
export function isPlainObject(o: any, hasKeys?: string[] ): boolean {
  const isPlainObj = o !== null && o !== undefined && Object.getPrototypeOf(o) === Object.prototype
  if (!isPlainObj) return false
  if (hasKeys === undefined) return isPlainObj
  return isPlainObj && hasKeys.every(key => key in o)
}


export function isPlainObject2(o: any, opts?: { hasKeys: string[] } ): o is Record<string, any> {
  const isPlainObj = o !== null && o !== undefined && Object.getPrototypeOf(o) === Object.prototype
  if (!isPlainObj) return false
  if (opts === undefined) return isPlainObj
  const hasKeys = opts.hasKeys.every(key => key in o)
  return isPlainObj && hasKeys
}

