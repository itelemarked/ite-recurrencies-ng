
export async function tryCatch<TData>(promise: Promise<TData>): Promise<[undefined, TData] | [Error]> {
  return promise
    .then(data => [undefined, data] as [undefined, TData])
    .catch(error => [error])
}