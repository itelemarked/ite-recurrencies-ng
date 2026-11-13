import { Component, inject } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { isMatch } from 'lodash';
import { AuthenticateFormComponent } from './authenticate-form/authenticate-form';
import { RecurrencyListComponent } from './recurrency-list-simple/recurrency-list-simple';




@Component({
  selector: 'app-testing-page',
  imports: [IonicModule, AuthenticateFormComponent, RecurrencyListComponent],
  template: `
    <ion-header collapse="fade" [translucent]="true">
      <ion-toolbar>
        <ion-title>Testing</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content [forceOverscroll]="false">

      <div class="ion-padding" style="border: 1px solid grey;">
        <app-authenticate-form/>
      </div>
      <div class="ion-padding" style="border: 1px solid grey; margin-top: 15px;">
        <app-recurrency-list/>
      </div>

    </ion-content>
  `,
  styles: [``],
})
export class TestingPage { 
  
}




