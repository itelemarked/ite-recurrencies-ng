import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideStore } from '@ngrx/store';

import { routes } from './app.routes';
import { provideIonicAngular } from '@ionic/angular/standalone';
import { CounterEffects, counterReducer } from './modules/counter-ngrx/counter.store';
import { provideEffects } from '@ngrx/effects';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideIonicAngular({}),
    provideStore({
        counter: counterReducer
    }),
    provideEffects([
      CounterEffects
    ])
]
};
