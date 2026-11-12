import { Component, inject } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { isMatch } from 'lodash';




@Component({
  selector: 'app-testing-page',
  imports: [IonicModule],
  template: `
    <ion-header collapse="fade" [translucent]="true">
      <ion-toolbar>
        <ion-title>Testing</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content [forceOverscroll]="false" class="ion-padding-horizontal">

      

    </ion-content>
  `,
  styles: [``],
})
export class TestingPage { 
  
}




