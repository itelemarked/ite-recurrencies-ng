import { Component } from "@angular/core";
import { IonIcon, IonTabBar, IonTabButton, IonTabs } from "@ionic/angular/standalone";
import { addIcons } from 'ionicons';
import { homeOutline, listOutline } from 'ionicons/icons';

@Component({
  selector: 'app-tabs',
  standalone: true,
  imports: [
    IonTabs,
    IonTabBar,
    IonTabButton,
    IonIcon
  ],
  template: `
    <ion-tabs>
      <ion-tab-bar slot="bottom">
        <ion-tab-button tab="home">
          <ion-icon name="home-outline"></ion-icon>
          Home
        </ion-tab-button>
        <ion-tab-button tab="recurrencies">
          <ion-icon name="list-outline"></ion-icon>
          Recurrencies
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  `,
  styles: [``]
})
export class TabsPage {
  
  constructor() {
    addIcons({ homeOutline, listOutline });
  }
}