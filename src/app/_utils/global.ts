
/**
 *
 * @param aClass - any regular class.
 * @returns - the class passed as parameter
 * 
 * This function is intended to wrap a model (a class) at the beginning of a piece of code, in order to reduce dependencies in the code.
 * It permits high level of maintanability, since another class which implements the same interface can be changed in a single place.
 * 
 * (Similarly as inject is used for services)
 * 
 * ```ts
 * const store = use(AngularfirestoreClass)
 * 
 * // if you want to change the class which shared the same interface, just replace this single line with:
 * const store = use(LocalstorageClass)
 * 
 * store.doSomething()
 * store.doAnotherSomething()
 * ```
 * 
 */
export function use<T>(aClass: T): T {
  return aClass
}

