
const CUSTOM_ERRORS = {
  '[AUTH]_USER_HAS_NO_EMAIL': 'User has no email...',
  '[AUTH]_SIGNUP_ERROR': 'There is some problem to signup...'
}



export class CustomError extends Error {

  constructor(
    message: keyof typeof CUSTOM_ERRORS,
    cause?: any
  ) {
    super(CUSTOM_ERRORS[message], cause)
    this.name = 'CUSTOM ERROR'
  }

}