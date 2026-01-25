import { State } from "./State";
import { User } from "./User";

export type AuthState = State<User | null>