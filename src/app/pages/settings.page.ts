import { Component } from "@angular/core";
import { IonContent, IonHeader, IonTitle, IonToolbar } from "@ionic/angular/standalone";

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent
  ],
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>
          Settings
        </ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content [forceOverscroll]="false">
      SettingsPage works!
    </ion-content>
  `,
  styles: [`

  `]
})
export class SettingsPage {

}