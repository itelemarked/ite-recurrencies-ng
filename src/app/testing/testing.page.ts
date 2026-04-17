import { Component, inject } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { TestingAuthService } from "./testing-auth-service/testing-auth-service";
import { AuthService2 } from '../core/services/auth-service2';


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

      <app-testing-auth-service/>

    </ion-content>
  `,
  styles: [``],
})
export class TestingPage {

  private auth2 = inject(AuthService2)

  constructor() {
    this.auth2.isLoading$.subscribe(val => console.log(val))
  }

}
