import { Component, inject } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { AuthService } from '../auth/services/auth-service';
import { TestingSettingsService2 } from './testing-settings-service/testing-settings-service2';
import { TestingAllServices } from './testing-all-services/testing-all-services';
import { isMatch } from 'lodash';




@Component({
  selector: 'app-testing-page',
  imports: [IonicModule, TestingAllServices],
  template: `
    <ion-header collapse="fade" [translucent]="true">
      <ion-toolbar>
        <ion-title>Testing</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content [forceOverscroll]="false" class="ion-padding-horizontal">

      <!-- <app-login-form
        
      /> -->
      <app-testing-all-services/>

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
    console.log(isMatch(
      {
        x: 0, 
        y: 2, 
        z: 3
      }, {
        x: 0
      }))
  }
}




