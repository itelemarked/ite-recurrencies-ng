
//  Inspired by 'https://www.youtube.com/watch?v=AdmGHwvgaVs&t=289s

export async function tryCatch<T>(promise: Promise<T>): Promise<[undefined, T] | [Error]> {
  try {
    return await promise as [undefined, T]
  }
  catch (error) {
    return [error] as [Error]
  }
}

