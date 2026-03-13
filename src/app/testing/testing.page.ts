import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { TestingUserFirebaseService } from "./testing-user-firebase-service/testing-user-firebase-service";

@Component({
  selector: 'app-testing-page',
  imports: [
    FormsModule, 
    IonicModule, 
    // TestingRecurrencyService, 
    TestingUserFirebaseService

  ],
  template: `
    <ion-header collapse="fade" [translucent]="true">
      <ion-toolbar>
        <ion-title>Testing</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content [forceOverscroll]="false">
      
      <!-- <app-testing-recurrency-service/> -->
      <app-testing-user-firebase-service/>

    </ion-content>
  `,
  styles: [``],
})
export class TestingPage {



}


