import { Component } from '@angular/core';
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
import { MainMenuComponent } from './components/main-menu.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    IonApp,
    IonRouterOutlet,
    IonMenu,
    IonContent,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonList,
    IonItem,
    IonLabel,
  ],
  template: `
    <ion-app>
      <ion-menu menuId="main-menu" contentId="main-content">
        <ion-header>
          <ion-toolbar>
            <ion-title>Settings</ion-title>
          </ion-toolbar>
        </ion-header>

        <ion-content [forceOverscroll]="false">
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
        </ion-content>
      </ion-menu>

      <ion-router-outlet id="main-content"></ion-router-outlet>
    </ion-app>
  `,
  styles: ``,
})
export class AppComponent {}
