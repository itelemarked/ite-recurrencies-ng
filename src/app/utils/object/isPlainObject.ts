
export function isPlainObject(o: any, opts?: { hasKeys: string[] } ) {
  const isPlainObj = o !== null && o !== undefined && Object.getPrototypeOf(o) === Object.prototype
  if (!isPlainObj) return false
  if (opts === undefined) return isPlainObj
  const hasKeys = opts.hasKeys.every(key => key in o)
  return isPlainObj && hasKeys
}