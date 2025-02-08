import { Component } from '@angular/core';
import { IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonMenuButton, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { menuOutline } from 'ionicons/icons';

@Component({
  selector: 'app-tab-home',
  standalone: true,
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButtons,
    IonButton,
    IonIcon,
    IonMenuButton
  ],
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-buttons>
          <!-- <ion-button>
            <ion-icon slot="icon-only" name="menu-outline"></ion-icon>
          </ion-button> -->
          <ion-menu-button menu="main-menu"></ion-menu-button>
        </ion-buttons>
        <ion-title>Home</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content [forceOverscroll]="false">
      <p>Recurrencies version 1.1</p>
    </ion-content>
  `,
  styles: ``,
})
export class TabHomePage {

  constructor() {
    addIcons({ menuOutline })
  }

} 