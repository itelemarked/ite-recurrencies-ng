import { ApplicationConfig, LOCALE_ID, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideIonicAngular } from '@ionic/angular/standalone';


import { firebaseConfig } from './core/stores/firebase-store.service';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { FIREBASE_OPTIONS } from '@angular/fire/compat';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getDatabase, provideDatabase } from '@angular/fire/database';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideIonicAngular({}),

    { provide: FIREBASE_OPTIONS, useValue: firebaseConfig },
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideFirestore(() => getFirestore()), provideFirebaseApp(() => initializeApp({"projectId":"ite-recurrencies","appId":"1:202558768735:web:fd080d6a7c97259c687dea","storageBucket":"ite-recurrencies.appspot.com","apiKey":"AIzaSyCH5hQQ-umEKcyfISQJ-JaM8Bi22Q3VYlk","authDomain":"ite-recurrencies.firebaseapp.com","messagingSenderId":"202558768735"})), provideAuth(() => getAuth()), provideFirestore(() => getFirestore()), provideDatabase(() => getDatabase()),
  ]
};
