
export class CustomError extends Error {
  code: string
  constructor({name, code, message}: {name:string, code:string, message: string}) {
    super(message)
    this.name = name
    this.code = code
  }
}