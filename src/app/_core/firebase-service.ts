import { Injectable } from '@angular/core';

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCH5hQQ-umEKcyfISQJ-JaM8Bi22Q3VYlk",
  authDomain: "ite-recurrencies.firebaseapp.com",
  projectId: "ite-recurrencies",
  storageBucket: "ite-recurrencies.firebasestorage.app",
  messagingSenderId: "202558768735",
  appId: "1:202558768735:web:fd080d6a7c97259c687dea"
}

@Injectable({ providedIn: 'root' })
export class FirebaseService {

  private readonly _app = initializeApp(firebaseConfig)
  private readonly _firestore = getFirestore(this._app)
  private readonly _auth = getAuth(this._app)

  get firestore() {
    return this._firestore
  }

  get auth() {
    return this._auth
  }

}
