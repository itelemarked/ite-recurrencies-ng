import { Component, inject } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { isMatch } from 'lodash';
import { AuthenticateFormComponent } from './authenticate-form/authenticate-form';




@Component({
  selector: 'app-testing-page',
  imports: [IonicModule, AuthenticateFormComponent],
  template: `
    <ion-header collapse="fade" [translucent]="true">
      <ion-toolbar>
        <ion-title>Testing</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content [forceOverscroll]="false" class="ion-padding-horizontal">

      <app-authenticate-form/>

    </ion-content>
  `,
  styles: [``],
})
export class TestingPage { 
  
}




