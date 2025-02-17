import { Component } from '@angular/core';

import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonItem,
  IonList,
  IonNote,
  IonRadio,
  IonRadioGroup,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { personCircleOutline } from 'ionicons/icons';

import { AppListComponent } from '../components/app-list.component';

@Component({
  selector: 'app-settings-dateformat',
  standalone: true,
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonNote,
    IonContent,
    IonButtons,
    IonBackButton,
    IonItem,
    IonRadioGroup,
    IonRadio,
    AppListComponent,
    IonList
  ],
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-buttons>
          <ion-back-button text="" defaultHref="/tabs/home"></ion-back-button>
        </ion-buttons>
        <ion-title>Date format</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content [forceOverscroll]="false">
      <ion-radio-group value="DD.MM.YYYY">
        <app-list class="mt-xl" [inset]="true">
          <ion-list>
            <ion-item>
              <ion-radio class="app-part-label-flex" value="PLATFORM_DEFINED">
                <span class="flex-1">Platform defined</span>
                <ion-note>2025/06/01</ion-note>
              </ion-radio>
            </ion-item>
          </ion-list>
        </app-list>

        <app-list 
          class="mt-lg" 
          [inset]="true"
        >  
          <ion-list>
            <ion-item>
              <ion-radio value="DD.MM.YYYY">** 01.06.2025 **</ion-radio>
            </ion-item>
            <ion-item>
              <ion-radio value="DD.MM.YY HH:mm:ss.SSS TIMEZONE">** 01.06.25 12:28:59.123 Europe/Zurich **</ion-radio>
            </ion-item>
            <ion-item>
              <ion-radio value="YYYY-MM-DD">** 2025-06-01 **</ion-radio>
            </ion-item>
          </ion-list>
        </app-list>
      </ion-radio-group>
    </ion-content>
  `,
  styles: `
    .app-user-item ion-icon {
      font-size: 4em;
    }

    /* STYLE THE LABEL PART OF ION-RADIO */
    ion-radio.app-part-label-flex::part(label) {
      display: flex;
      width: 100%;
    }

  `,
})
export class SettingsDateformatPage {
  constructor() {
    addIcons({ personCircleOutline });
  }
}
