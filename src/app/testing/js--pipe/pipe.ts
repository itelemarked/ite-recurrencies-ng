

export function pipe<A, B>(
  ab: (input: A) => B
): (x: unknown) => B
export function pipe<A, B, C>(
  ab: (input: A) => B, 
  bc: (input: B) => C
): (x: unknown) => C
export function pipe<A, B, C, D>(
  ab: (input: A) => B,
  bc: (input: B) => C,
  cd: (input: C) => D
): (x: unknown) => D
export function pipe<A, B, C, D, E>(
  ab: (input: A) => B,
  bc: (input: B) => C,
  cd: (input: C) => D,
  de: (input: D) => E
): (x: unknown) => E
export function pipe(
  ab: Function,
  bc?: Function,
  cd?: Function,
  de?: Function
) {
  switch (arguments.length) {
    case 1:
      return (x: unknown) => ab(x)
    case 2:
      return (x: unknown) => bc!(ab(x))
    case 3:
      return (x: unknown) => cd!(bc!(ab(x)))
    case 4:
      return (x: unknown) => de!(cd!(bc!(ab(x))))
    default:
      throw new Error('invalid arguments')
  }
}
