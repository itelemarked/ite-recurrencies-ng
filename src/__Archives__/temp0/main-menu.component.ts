import { Component, input } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {
  IonApp,
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonMenu,
  IonRouterOutlet,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-main-menu',
  standalone: true,
  imports: [
    IonList,
    IonItem,
    IonLabel
  ],
  template: `
    <ion-list [inset]="true">
      <ion-item>
        <ion-label>
          <p>aaa</p>
          <p>bbb</p>
        </ion-label>
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
    </ion-list>
  `,
  styles: ``,
})
export class MainMenuComponent {}