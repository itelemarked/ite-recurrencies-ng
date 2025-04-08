
export class CustomTypeError extends Error {
  constructor(RequestedTypeName: string, value: any) {
    super(`'${value}' is not of type '${RequestedTypeName}'`)
    this.name = 'Custom-Type-Error'
  }
}