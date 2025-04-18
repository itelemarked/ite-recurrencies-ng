

/**
 * Avoid try { (...) } catch(err) { (...) } unwanted side effects:
 * - Limit the try block to the essential purpose: Make sure no other errors in the try block makes unwanted side effects.
 * - Make the error explicit in the function return statement (instead of hidden in case of throwing)
 * The type error defaults to Error object. If needed, you may explicit type the error instance (the result type will be inferred!)
 * 
 * Example of use:
 *   const [err, result] = await tryCatch<number, CustomError>(anyPromiseHere)
 *   if (err) {
 *    // handle err here
 *   } else {
 *    // handle result here
 *   }
 */

export async function tryCatch<T, E = Error>(promise: Promise<T>): Promise<[null, T] | [E, null]> {
  try {
    const result = await promise
    return [null, result]
  } catch(err) {
    return [err as E, null]
  }
}