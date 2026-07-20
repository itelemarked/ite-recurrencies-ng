
/**
 * 
 * Since throw can be used with any type of variables, this function makes sure that the error thrown is converted to an 'Error' object.
 * Use mainly in the catch block of a try-catch.
 * 
 * @param {unknown} value 
 * @returns An Error object. Note that it returns only the base class 'Error' and not the potential inherited objects!
 * 
 * @example
 * 
 * (...)
 * try {
 *    somethingWhichCanThrow()
 * } catch (err: unknown) {
 *    // 'error' is of type Error, and has surely a 'message' property!
 *    const error = assertError(err)
 * 
 *    // do something with the error here (handle, rethrow, etc...)
 *    console.log(error.message)
 * }
 */
export function assertError(value: unknown): Error {
  if (value instanceof Error) return value

  let stringified = '*** Value is not stringifiable... ***'
  try {
    stringified = JSON.stringify(value)
  } catch {}

  const error = new Error(`Unknown thrown error, stringified value: '${stringified}'`)
  return error
}
