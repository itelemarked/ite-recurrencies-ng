import { Component, CUSTOM_ELEMENTS_SCHEMA, inject } from '@angular/core';
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
  IonRadio,
  IonRadioGroup,
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
import { HelloWorldComponent } from '../components/temp/hello-world.component';
import { ReplaceDirective } from '../components/temp/replace.directive';
import { ItemComponent } from '../components/temp/item.component';
import { ItemButtonComponent } from '../components/temp/item-button.component';
import { ListComponent } from '../components/temp/list.component';
import { ItemToggleComponent } from '../components/temp/item-toggle';

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
    OptionComponent,
    HelloWorldComponent,
    ReplaceDirective,
    ItemComponent,
    ItemButtonComponent,
    IonRadioGroup,
    IonRadio,
    ListComponent,
    ItemToggleComponent
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

      <!-- <ion-list [inset]="true">
        <ion-item [button]="true">
          <ion-icon
            name="person-circle-outline"
            slot="start"
            style="font-size: 50px;"
          ></ion-icon>
          <ion-label>**USERNAME**</ion-label>
        </ion-item>
      </ion-list>

      <div>aaa</div>
      <ion-list>
        <ion-item [button]="true">
          <ion-label>Date format</ion-label>
          <ion-note>**01.01.2025**</ion-note>
        </ion-item>
        <ion-item>
          <ion-label>Date format</ion-label>
          <ion-note>**01.01.2025**</ion-note>
        </ion-item>
        <ion-item [button]="true" lines="none">
          <ion-label>Timezone</ion-label>
          <ion-note>**Europe/Zurich**</ion-note>
        </ion-item>
      </ion-list> -->


      <!-- <div class="list-wrapper">
        <div class="list-header">TITLE</div>
        <ion-list class="list">
          <ion-item>
            <ion-label>Simple</ion-label>
            <ion-note>item</ion-note>
          </ion-item>
          <ion-item [button]="true">
            <ion-label>Button</ion-label>
            <ion-note>item</ion-note>
          </ion-item>
          <ion-item>
            <ion-toggle>Toggle</ion-toggle>
          </ion-item>
        </ion-list>
        <div class="list-footer">This is some text to show some useful comments! It may be very long text!</div>
      </div> -->

      <app-list>
        <ng-container list-header>A TITLE</ng-container>

        <ng-container list-items>
          <app-item 
            label="Do something now"
            note="done"
          />
          <app-item-button
            label="Do something else"
            note="yep!"
          />
          <app-item-toggle
            label="Agree??"
          />
        </ng-container>

        <ng-container list-footer>Some explanation here!!</ng-container>
      </app-list>

      <div class="list-wrapper">
        <div class="list-header">OPTIONS</div>
        <ion-list class="list">
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
        </ion-list>
        <div class="list-footer">This is some text to show some useful comments! It may be very long text!</div>
      </div>
    </ion-content>
  `,
  styles: `

    .list-wrapper {
      padding: 16px;
    }

    .list-header {
      padding: 0 16px;
      margin-bottom: 6px;
      font-size: 0.75em;
      font-weight: 600;
    }
    
    .list {
      border-radius: 10px;
    }

    .list-footer {
      margin-top: 6px;
      padding: 0 16px;
      font-size: 0.75em;
      color: var(--ion-color-step-500);
    }

    ion-item {
      --background: var(--ion-color-step-50);
    }
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
