import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import {
  IonIcon,
  IonTabBar,
  IonTabButton,
  IonTabs,
} from '@ionic/angular/standalone';

import { addIcons } from 'ionicons';
import { homeOutline, alarmOutline, listOutline, cogOutline } from 'ionicons/icons';

@Component({
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
        <!-- <ion-tab-button tab="home">
          <ion-icon name="home-outline"></ion-icon>
          Home
        </ion-tab-button> -->
        <ion-tab-button tab="recurrencies">
          <ion-icon name="alarm-outline"></ion-icon>
          Recurrencies
        </ion-tab-button>
        <ion-tab-button tab="brb">
          <ion-icon name="list-outline"></ion-icon>
          BRB
        </ion-tab-button>
        <ion-tab-button tab="settings">
          <ion-icon name="cog-outline"></ion-icon>
          Settings
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  `,
  styles: ``,
  host: {
    '[attr.aria-hidden]': 'false',
  }
})
export class TabsPage {
  constructor() {
    addIcons({ 
      // homeOutline, 
      alarmOutline, 
      listOutline,
      cogOutline
    })
  }
}
