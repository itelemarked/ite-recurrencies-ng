import { Component } from '@angular/core';

import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonNote,
  IonRadio,
  IonRadioGroup,
  IonTitle,
  IonToolbar,
  IonList
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { personCircleOutline } from 'ionicons/icons';

import { AppListComponent } from '@shared/components/app-list.component';

@Component({
  selector: 'app-settings-timezone',
  standalone: true,
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButtons,
    IonBackButton,
    IonItem,
    IonRadioGroup,
    IonRadio,
    IonNote,
    AppListComponent,
    IonList
  ],
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-buttons>
          <ion-back-button text="" defaultHref="/tabs/home"></ion-back-button>
        </ion-buttons>
        <ion-title>Timezone</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content [forceOverscroll]="false">
      <ion-radio-group value="Europe/Zurich">
        <app-list class="mt-xl">
          <ion-list>
            <ion-item>
              <ion-radio class="app-part-label-flex" value="PLATFORM_DEFINED">
                <span class="flex-1">Platform defined</span>
                <ion-note>Europe/Zurich</ion-note>
              </ion-radio>
            </ion-item>
          </ion-list>
        </app-list>

        <app-list
          class="mt-lg"
        >
          <ion-list>
            <header>AVAILABLE TIMEZONES</header>
            <ion-item>
              <ion-radio value="Europe/Zurich">** Europe/Zurich **</ion-radio>
            </ion-item>
            <ion-item>
              <ion-radio value="Indian/Mauritius">** Indian/Mauritius **</ion-radio>
            </ion-item>
            <ion-item>
              <ion-radio value="UTC">** UTC **</ion-radio>
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
export class SettingsTimezoneOptionsPage {
  constructor() {
    addIcons({ personCircleOutline });
  }
}
