import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  IonContent,
  IonHeader,
  IonIcon,
  IonTabBar,
  IonTabButton,
  IonTitle,
  IonToolbar,
  IonTabs,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { homeOutline, alarmOutline, listOutline } from 'ionicons/icons';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    IonTabs,
    IonTabBar,
    IonTabButton,
    IonIcon,
  ],
  template: `
    <ion-tabs>
      <ion-tab-bar slot="bottom">
        <ion-tab-button tab="home">
          <ion-icon name="home-outline"></ion-icon>
          Home
        </ion-tab-button>
        <ion-tab-button tab="recurrencies">
          <ion-icon name="alarm-outline"></ion-icon>
          Recurrencies
        </ion-tab-button>
        <!-- <ion-tab-button tab="library">
          <ion-icon name="library"></ion-icon>
          BRB
        </ion-tab-button> -->
        <ion-tab-button tab="testing">
          <ion-icon name="list-outline"></ion-icon>
          Testing...
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  `,
  styles: ``,
})
export class TabsPage {
  constructor() {
    addIcons({ homeOutline, alarmOutline, listOutline })
  }
}
