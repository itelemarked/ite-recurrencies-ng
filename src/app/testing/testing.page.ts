import { Component, inject } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { TestingAuthService } from "./testing-auth-service/testing-auth-service";


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

  constructor() {}

}

