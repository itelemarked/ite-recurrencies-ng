import { Component, inject } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { TestingAuthService } from './testing-auth-service/testing-auth-service';
import { AuthService } from '../auth/services/auth-service3';



@Component({
  selector: 'app-testing-page',
  imports: [IonicModule, TestingAuthService],
  template: `
    <ion-header collapse="fade" [translucent]="true">
      <ion-toolbar>
        <ion-title>Testing</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content [forceOverscroll]="false" class="ion-padding-horizontal">

      <!-- <app-login-form
        
      /> -->
      <app-testing-auth-service/>

    </ion-content>
  `,
  styles: [``],
})
export class TestingPage { 

  private authService = inject(AuthService)

  // protected backendAuthErrors = signal<AuthError[]>([
  //   {
  //     code: 'email-already-exists',
  //     message: 'An account with this email already exists.'
  //   }
  // ])

  constructor() {
    // this.authService.login('aa', 'a')
    //   .then(() => console.log('login success'))
    //   .catch((err) => console.log(err))
  }
}




