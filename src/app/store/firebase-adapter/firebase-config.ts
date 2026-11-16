import { InjectionToken } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { initializeFirestore, Firestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCH5hQQ-umEKcyfISQJ-JaM8Bi22Q3VYlk",
  authDomain: "ite-recurrencies.firebaseapp.com",
  projectId: "ite-recurrencies",
  storageBucket: "ite-recurrencies.firebasestorage.app",
  messagingSenderId: "202558768735",
  appId: "1:202558768735:web:fd080d6a7c97259c687dea"
}

const app = initializeApp(firebaseConfig);
const firestoreInstance = initializeFirestore(app, { ignoreUndefinedProperties: true });
const authInstance = getAuth(app);

export const FIRESTORE = new InjectionToken<Firestore>('Firebase Firestore Instance', {
  providedIn: 'root',
  factory: () => firestoreInstance
});

export const FIREBASE_AUTH = new InjectionToken<Auth>('Firebase Auth Instance', {
  providedIn: 'root',
  factory: () => authInstance
});
