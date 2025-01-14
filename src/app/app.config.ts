import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideIonicAngular } from '@ionic/angular/standalone';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getDatabase, provideDatabase } from '@angular/fire/database';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideIonicAngular({}),
    provideFirebaseApp(() => initializeApp({
      "projectId":"ite-recurrencies",
      "appId":"1:202558768735:web:fd080d6a7c97259c687dea",
      "storageBucket":"ite-recurrencies.firebasestorage.app",
      "apiKey":"AIzaSyCH5hQQ-umEKcyfISQJ-JaM8Bi22Q3VYlk",
      "authDomain":"ite-recurrencies.firebaseapp.com",
      "messagingSenderId":"202558768735"
    })), 
    provideAuth(() => getAuth()), 
    provideFirestore(() => getFirestore()), 
    provideDatabase(() => getDatabase())
  ]
};
