export class AuthError extends Error {
  
  readonly code

  constructor(code: string, message: string, options?: ErrorOptions) {
    super(message, options)
    this.name = 'ITE_AUTH_ERROR'
    this.code = code
  }

}