import { Component, signal } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { LoginForm } from '../auth/components/login-form';
import { AuthError } from '../_types/AuthErrors';




@Component({
  selector: 'app-testing-page',
  imports: [IonicModule, LoginForm],
  template: `
    <ion-header collapse="fade" [translucent]="true">
      <ion-toolbar>
        <ion-title>Testing</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content [forceOverscroll]="false" class="ion-padding-horizontal">

      <app-login-form
        [authErrors]="backendAuthErrors()"
      />

    </ion-content>
  `,
  styles: [``],
})
export class TestingPage { 

  // private auth = inject(FirebaseService).auth
  protected backendAuthErrors = signal<AuthError[]>([
    {
      code: 'email-already-exists',
      message: 'An account with this email already exists.'
    }
  ])

  constructor() {
    
  }
}

