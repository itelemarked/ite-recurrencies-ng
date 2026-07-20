import { Component, inject, signal } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { LoginForm } from '../auth/components/login-form';
import { AuthError } from '../_types/AuthErrors';
import { AuthService2 } from '../auth/services/auth-service2';
import { isPlainObject } from '../../js/types/valid-type';



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
        
      />

    </ion-content>
  `,
  styles: [``],
})
export class TestingPage { 

  private authService = inject(AuthService2)

  // protected backendAuthErrors = signal<AuthError[]>([
  //   {
  //     code: 'email-already-exists',
  //     message: 'An account with this email already exists.'
  //   }
  // ])

  constructor() {
    this.authService.login('aa', 'a')
      .then(() => console.log('login success'))
      .catch((err) => console.log(err))
  }
}


