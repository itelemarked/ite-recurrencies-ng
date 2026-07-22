import { Injectable } from '@angular/core';

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

import { deleteDoc, doc, onSnapshot, setDoc, updateDoc } from "firebase/firestore";
import { FirebaseError } from "firebase/app";

export { deleteDoc, doc, onSnapshot, setDoc, updateDoc, FirebaseError}

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

  readonly firestore = getFirestore(this._app)

  readonly auth = getAuth(this._app)

  // readonly deleteDoc = deleteDoc

  // readonly doc = doc

  // readonly onSnapshot = onSnapshot

  // setDoc = setDoc

  // updateDoc = updateDoc

  FirebaseError = FirebaseError

}
