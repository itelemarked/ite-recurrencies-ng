import { Component } from "@angular/core";
import { IonContent, IonHeader, IonTitle, IonToolbar } from "@ionic/angular/standalone";

@Component({
  selector: 'app-recurrencies',
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
          Recurrencies
        </ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content [forceOverscroll]="false">
      RecurrenciesPage works!
    </ion-content>
  `,
  styles: [``]
})
export class RecurrenciesPage {

}