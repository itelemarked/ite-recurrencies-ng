import { signal, Signal, WritableSignal } from "@angular/core"
import { User } from "./User"
import { UserServiceState } from "./UserServiceState"

export interface UserServiceInterface {
  user: Signal<User | null>
  isLoading: Signal<boolean>
  error: Signal<string | null>

  /**
   * Asynchronously signs in using an email and password. 
   * This promise returns the service state, and never throw errors (the error is passed to the service state instead.)  
   * 
   * ---
   * From Firebase docs: (???)  
   * "When Email Enumeration Protection is enabled, this method fails with "auth/invalid-credential" in case of an invalid email/password."  
   * "This method is not supported on Auth instances created with a FirebaseServerApp)"  
   */
  login: (email: string, password: string) => Promise<UserServiceState>

  /**
   * Creates a new user account associated with the specified email address and password.  
   * On successful creation of the user account, this user will also be signed in to your application.  
   * This promise returns the service state, and never throw errors (the error is passed to the service state instead.)  
   * User account creation trigger state.error if the account already exists or the password is invalid.  
   * 
   * ---
   * From Firebase docs: (???)  
   * "This method is not supported on Auth instances created with a FirebaseServerApp."
   */
  signup: (email: string, password: string) => Promise<UserServiceState>

  /**
   * Signs out the current user.  
   * This promise returns the service state, and never throw errors (there are no errors triggered for this functions)   
   * 
   * ---
   * From Firebase docs: (???) 
   * "This method is not supported by Auth instances created with a FirebaseServerApp."  
   */
  logout: () => Promise<UserServiceState>

  /**
   * Deletes and signs out the current user.  
   */
  deleteCurrentUser: () => Promise<UserServiceState>
}