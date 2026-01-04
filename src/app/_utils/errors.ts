export class CustomTypeError extends Error {

  constructor(message?: string, options?: ErrorOptions) {
    super(message, options)
    this.name = 'CUSTOM_TYPE_ERROR'
  }

}


export async function tryCatch<TData>(promise: Promise<TData>): Promise<[undefined, TData] | [Error]> {
  return promise
    .then(data => [undefined, data] as [undefined, TData])
    .catch(error => [error])
}