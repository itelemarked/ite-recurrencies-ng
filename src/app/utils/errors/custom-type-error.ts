
export class CustomTypeError extends Error {
  constructor(value: unknown, type: string) {
    super(`value '${value}' cannot be converted in '${type}'...`)
    this.name = 'CustomTypeError'
  }
}