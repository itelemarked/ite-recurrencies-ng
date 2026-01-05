import { Injectable } from "@angular/core";

import { Observable, of } from "rxjs";
import { User } from "./User";



@Injectable({providedIn: 'root'})
export class AuthFirebaseService {

  user$: Observable<User | null | undefined> = of({
    uid: '0yuA0RLZFJdbRKtVSfW4y5HSQMq1',
    email: 'aaa@aaa.com'
  })

}