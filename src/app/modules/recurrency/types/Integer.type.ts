
export type Integer = number & {_type: 'Integer'}

export function toInteger(val: number): Integer {
  const isInteger = Number.isInteger(val)

  if(!isInteger) throw new Error(`Custom Type Error: "${val}" cannot be converted into Integer...`)
  return val as Integer
}