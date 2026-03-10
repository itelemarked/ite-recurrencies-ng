import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { TodoPage } from './todo/todo-page';
import { TimeString } from '../../js/timezone-date/types/TimeString';
import { DateString } from '../../js/timezone-date/types/DateString';
import { Timezone } from '../../js/timezone-date/types/Timezone';
import { TimezoneDate2 } from '../../js/timezone-date/TimezoneDate2';
import { DateFormat } from '../../js/timezone-date/types/DateFormat';

@Component({
  selector: 'app-testing-page',
  imports: [FormsModule, IonicModule],
  template: `
    <ion-header collapse="fade" [translucent]="true">
      <ion-toolbar>
        <ion-title>Testing</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content [forceOverscroll]="false">
      
      <!-- <app-todo-page/> -->
       <!-- <app-model-input-page/> -->

    </ion-content>
  `,
  styles: [``],
})
export class TestingPage {

  constructor() {}

}


