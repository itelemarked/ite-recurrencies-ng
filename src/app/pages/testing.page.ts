import { Component } from '@angular/core';
import {
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonRadio,
  IonRadioGroup,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';

import { addIcons } from 'ionicons';
import { personCircleOutline } from 'ionicons/icons';

import { ListComponent } from '../components/list.component';

@Component({
  selector: 'app-testing',
  standalone: true,
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonItem,
    IonRadioGroup,
    IonRadio,
    IonLabel,
    ListComponent
  ],
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>Settings</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content [forceOverscroll]="false">
      
      <app-list
        class="mt-lg"
        [inset]="true" 
        header="TITLE"
        footer="This is some text to describe the list and which could be quite long if the user wishes so!!"
      >
        <ion-item>
          <ion-label>Pokémon Yellow</ion-label>
        </ion-item>
        <ion-item>
          <ion-label>Mega Man X</ion-label>
        </ion-item>
        <ion-item>
          <ion-label>The Legend of Zelda</ion-label>
        </ion-item>
        <ion-item>
          <ion-label>Pac-Man</ion-label>
        </ion-item>
        <ion-item>
          <ion-label>Super Mario World</ion-label>
        </ion-item>
      </app-list>

      <app-list 
        class="mt-xl" 
        [inset]="true"
        header="OPTIONS"
      >
        <ion-radio-group value="second">
          <ion-item>
            <ion-radio value="first">first</ion-radio>
          </ion-item>
          <ion-item>
            <ion-radio value="second">second</ion-radio>
          </ion-item>
          <ion-item>
            <ion-radio value="third">third</ion-radio>
          </ion-item>
        </ion-radio-group>
      </app-list>
    </ion-content>
  `,
  styles: `

  `,
})
export class TestingPage {
  selectValue = 1;
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

  animated = false;

  onAnimate() {
    this.animated = false;
    setTimeout(() => {
      this.animated = true;
    }, 100);
    setTimeout(() => {
      this.animated = false;
    }, 1000);
  }

  TEST() {}
}
