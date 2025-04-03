import { Component } from "@angular/core";
import { IonContent, IonHeader, IonTitle, IonToolbar } from "@ionic/angular/standalone";
import { SettingsContentComponent } from "./_components/settings-content.component";

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    SettingsContentComponent
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
      <app-settings-content/>
    </ion-content>
  `,
  styles: [``]
})
export class SettingsPage {

}