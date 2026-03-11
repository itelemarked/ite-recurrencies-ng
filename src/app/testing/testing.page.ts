import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { SettingsService } from '../recurrencies/services/settings-service';
import { TestingRecurrencyService } from "./testing-recurrency-service/testing-recurrency-service";

@Component({
  selector: 'app-testing-page',
  imports: [FormsModule, IonicModule, TestingRecurrencyService],
  template: `
    <ion-header collapse="fade" [translucent]="true">
      <ion-toolbar>
        <ion-title>Testing</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content [forceOverscroll]="false">
      
      <app-testing-recurrency-service/>

    </ion-content>
  `,
  styles: [``],
})
export class TestingPage {

  private settingsService = inject(SettingsService)

  constructor() {

  }

}


