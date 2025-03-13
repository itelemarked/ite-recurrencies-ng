import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonMenuButton, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { cogOutline } from 'ionicons/icons';
import { RouterLinkDirective } from '@shared/directives/router-link.directive';
import { BlurOnClickDirective } from '@shared/directives/blur-on-click.directive';

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
    RouterLink,
    RouterLinkDirective,
    BlurOnClickDirective
  ],
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="end">
          <ion-button appBlurOnClick routerLink="/settings">
            <ion-icon slot="icon-only" name="cog-outline"></ion-icon>
          </ion-button>
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
export class TabsHomePage {
  router = inject(Router)

  constructor() {
    addIcons({ cogOutline })
  }

} 