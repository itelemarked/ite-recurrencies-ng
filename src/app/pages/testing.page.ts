import { Component, inject } from '@angular/core';
import {
  IonButton,
  IonCheckbox,
  IonContent,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonNote,
  IonSpinner,
  IonTitle,
  IonToggle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';

import { addIcons } from 'ionicons';
import { personCircleOutline } from 'ionicons/icons';
import { SelectComponent } from '../components/temp/select.component';
import { OptionComponent } from '../components/temp/option.component';

@Component({
  selector: 'app-testing',
  standalone: true,
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonList,
    IonListHeader,
    IonItem,
    IonLabel,
    IonIcon,
    IonButton,
    IonNote,
    IonToggle,
    SelectComponent,
    OptionComponent
  ],
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>Settings</ion-title>
        <!-- <div class="p-md">
          <div style="text-align: center;">
            <ion-icon
              name="person-circle-outline"
              color="primary"
              style="font-size: 150px;"
            />
          </div>
          <div style="text-align: center;">USER EMAIL</div>
          <div style="text-align: center;" class="pt-md">
            <ion-button size="small" fill="clear" color="danger">logout</ion-button>
          </div>
        </div> -->
      </ion-toolbar>
    </ion-header>

    <ion-content [forceOverscroll]="false">

      <div class="text-xs" style="margin: 16px 16px 0 16px; padding-left: 16px;">USER</div>
      <ion-list [inset]="true" style="margin-top: 4px;">
        <ion-item [button]="true">
          <ion-icon name="person-circle-outline" slot="start" style="font-size: 50px;"></ion-icon>
          <ion-label>**USERNAME**</ion-label>
        </ion-item>
      </ion-list>

      <div class="text-xs" style="margin: 16px 16px 0 16px; padding-left: 16px;">SETTINGS</div>
      <ion-list [inset]="true" style="margin-top: 4px;">
        <ion-item [button]="true">
          <ion-label>Date format</ion-label>
          <ion-note>**01.01.2025**</ion-note>
        </ion-item>
        <ion-item [button]="true">
          <ion-label>Timezone</ion-label>
          <ion-note>**Europe/Zurich**</ion-note>
        </ion-item>
      </ion-list>

      <div>
        <ion-list [inset]="true">
          <ion-item [button]="true">
            <ion-label>Foo</ion-label>
            <ion-note>bar</ion-note>
          </ion-item>
          <ion-item [button]="true">
            <ion-label>Foo2</ion-label>
            <ion-note>bar2</ion-note>
          </ion-item>
        </ion-list>
      </div>

      <div class="p-md">
        <p>selectValue: {{ selectValue }}</p>
        <app-select [(value)]="selectValue">
          <app-option label="label-a" [value]="1"></app-option>
          <app-option label="label-b" [value]="2"></app-option>
        </app-select>
      </div>

    </ion-content>
  `,
  styles: `
    ion-item {
      --background: var(--ion-color-step-50);
    }
  `,
})
export class TestingPage {
  selectValue = 1
  // firestore = inject(AngularFirestore)
  // fireauth = inject(AngularFireAuth)
  // recurrencyService = inject(RecurrencyService)
  // authService = inject(AuthService)
  // settingsService = inject(SettingsService)

  settingsTimezone = '';

  loginSignup: 'login' | 'signup' = 'login';

  constructor() {
    addIcons({ personCircleOutline });
    this.TEST();
  }

  TEST() {
    setTimeout(() => {
      this.selectValue = 2
    }, 3000);
  }
}
