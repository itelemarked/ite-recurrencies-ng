
export async function tryCatch<TData>(promise: Promise<TData>): Promise<[undefined, TData] | [Error]> {
  return promise
    .then(data => [undefined, data] as [undefined, TData])
    .catch(error => [error])
}





// export function tryCatch2<TData>(tryer: () => TData): Promise<[undefined, TData] | [Error, undefined]>
// export function tryCatch2<TData>(promise: Promise<TData>): Promise<[undefined, TData] | [Error]>
export function tryCatch2<TData>(tryerFn: () => Promise<TData> | TData): Promise<[undefined, TData] | [Error, undefined]> {
  const tryer = tryerFn()
  if (tryerFn() instanceof Promise) {
    return tryCatchWithPromise(tryerFn as () => Promise<TData>)
  }
  return tryCatchWithFunction(tryerFn as () => TData)
}


export function tryCatchWithFunction<TData>(tryer: () => TData) {
    try {
      const result = tryer()
      return Promise.resolve([undefined, result] as [undefined, TData])
    } catch (error) {
      return Promise.resolve([error, undefined] as [Error, undefined])
    }
}

export function tryCatchWithPromise<TData>(tryer: () => Promise<TData>): Promise<[undefined, TData] | [Error, undefined]> {
  const promise = tryer()
  return promise
    .then(data => [undefined, data] as [undefined, TData])
    .catch(error => [error, undefined] as [Error, undefined])
}


