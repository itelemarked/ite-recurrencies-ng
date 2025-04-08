import { Component } from "@angular/core";
import { RouterLink } from "@angular/router";
import { IonButton } from "@ionic/angular/standalone";

@Component({
  selector: 'app-settings-content',
  standalone: true,
  imports: [
    IonButton,
    RouterLink
  ],
  template: `
    <ion-button routerLink="./dateFormat">go to date-format</ion-button>
  `,
  styles: [``]
})
export class SettingsContentComponent {

}