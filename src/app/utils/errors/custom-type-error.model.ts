
export class CustomTypeError extends Error {

  constructor(message?: string, options?: ErrorOptions) {
    super(message, options)
    this.name = 'CUSTOM_TYPE_ERROR'
  }

}