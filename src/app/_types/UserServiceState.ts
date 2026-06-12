import { User } from "./User"

export type UserServiceState = {
  isLoading: boolean,
  user: User | null,
  error: string | null
}