
export class CustomError extends Error {
  code: string
  constructor({code, message, name = 'CustomError'}: {code: string, message: string, name?: string}) {
    super(message)
    this.name = name
    this.code = code
  }
}