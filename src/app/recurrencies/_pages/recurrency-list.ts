import { Component } from "@angular/core";
import { IonContent, IonHeader, IonTitle, IonToolbar } from "@ionic/angular/standalone";

@Component({
  selector: 'app-recurrency-list',
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
          RecurrencyList
        </ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content [forceOverscroll]="false">
      RecurrencyListPage works!
    </ion-content>
  `,
  styles: [``]
})
export class RecurrencyListPage {

}