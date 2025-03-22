
/**
 * TODO: possible to return a type predicate instead of boolean??? Generics?
 */

export function hasKeys(o: Record<string, any>, keys: string[]): boolean {
  return keys.every(key => key in o)
}