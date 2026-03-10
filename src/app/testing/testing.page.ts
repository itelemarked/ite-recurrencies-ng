import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { TodoPage } from './todo/todo-page';
import { TimeString } from '../../js/timezone-date/types/TimeString';
import { DateString } from '../../js/timezone-date/types/DateString';
import { Timezone } from '../../js/timezone-date/types/Timezone';
import { TimezoneDate } from '../../js/timezone-date/TimezoneDate';
import { DATE_FORMAT, DateFormat } from '../../js/timezone-date/types/DateFormat';
import { SettingsService } from '../recurrencies/services/settings-service';

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

  private settingsService = inject(SettingsService)

  constructor() {
    // this.settingsService.getDoc().then(res => console.log(res))
    // this.settingsService.setDoc({timezone: 'Indian/Mauritius', dateFormat: 'ISO'})
    // this.settingsService.updateDoc({timezone: undefined, dateFormat: 'CH_DATE_TIME'})
    // this.settingsService.deleteDoc()
  }

}


