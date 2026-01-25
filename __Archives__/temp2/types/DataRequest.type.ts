
export type DataRequestLoading = {
  state: 'loading'
}

export type DataRequestNoDataFound = {
  state: 'data-not-found'
}

export type DataRequestDataFound<T> = {
  state: 'data-found',
  value: T
}

// export type DataRequestError = {
//   state: 'error',
//   error: Error
// }

export type DataRequest<T> = DataRequestLoading | DataRequestNoDataFound | DataRequestDataFound<T>