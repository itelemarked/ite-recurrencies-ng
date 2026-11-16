import { InjectionToken } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import {
  Firestore,
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCH5hQQ-umEKcyfISQJ-JaM8Bi22Q3VYlk",
  authDomain: "ite-recurrencies.firebaseapp.com",
  projectId: "ite-recurrencies",
  storageBucket: "ite-recurrencies.firebasestorage.app",
  messagingSenderId: "202558768735",
  appId: "1:202558768735:web:fd080d6a7c97259c687dea"
}

const app = initializeApp(firebaseConfig);
// Settings must be set here, before any Firestore read or write.
// - ignoreUndefinedProperties: undefined = "not provided" (the mock does the same).
// - localCache: offline cache in IndexedDB, shared between browser tabs. It stays on the
//   device after logout (accepted on purpose, see Persist 8).
const firestoreInstance = initializeFirestore(app, {
  ignoreUndefinedProperties: true,
  localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() }),
});
const authInstance = getAuth(app);

export const FIRESTORE = new InjectionToken<Firestore>('Firebase Firestore Instance', {
  providedIn: 'root',
  factory: () => firestoreInstance
});

export const FIREBASE_AUTH = new InjectionToken<Auth>('Firebase Auth Instance', {
  providedIn: 'root',
  factory: () => authInstance
});
