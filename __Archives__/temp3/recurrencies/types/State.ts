export type State<T> =
  | {
      state: 'success'
      data: T;
    }
  | {
      state: 'error'
      message: string
    }
  | {
      state: 'loading'
    }
