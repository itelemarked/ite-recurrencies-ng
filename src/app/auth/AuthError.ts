// export const AUTH_ERROR = [
//   {
//     code: 'user-is-null-after-login',
//     message: 'User shouldn\'t return null after logging in...'
//   },
//   {
//     code: 'user-email-is-null-after-login',
//     message: 'User email shouldn\'t return null after logging in...'
//   },
// ] as const

// type AuthErrorUnion = typeof AUTH_ERROR[number]
// type AuthErrorCode = Extract<AuthErrorUnion['code'], any>

// function getMessage(code: AuthErrorCode) {
//   return AUTH_ERROR.find(err => err.code === code)!.message
// }


// // export const AUTH_ERROR = {
// //   'user-is-null-after-login': 'User shouldn\'t return null after logging in...',
// //   'user-email-is-null-after-login': 'User email shouldn\'t return null after logging in...'
// // } as const

// // type AuthErrorCode = keyof typeof AUTH_ERROR




// export class AuthError extends Error {

//   readonly code: string
//   // readonly message: string

//   constructor(authErrorCode: AuthErrorCode, options?: ErrorOptions) {
//     super(getMessage(authErrorCode), options)
//     this.name = 'ITE_AUTH_ERROR'
//     this.code = authErrorCode
//   }

// }

// const err = new AuthError('user-email-is-null-after-login')
// const mes = err.message




export class AuthError extends Error {

  readonly code: string
  // readonly message: string

  constructor(code: string, message: string, options?: ErrorOptions) {
    super(message, options)
    this.name = 'AUTH_ERROR'
    this.code = code
  }

}