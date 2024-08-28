import { Component } from '@angular/core';
import { IonButton, IonContent, IonHeader, IonRouterOutlet, IonTitle, IonToolbar } from '@ionic/angular/standalone';

@Component({
  selector: 'app-recurrencies',
  standalone: true,
  imports: [IonRouterOutlet],
  template: `
    <ion-router-outlet></ion-router-outlet>
  `,
  styles: ``,
})
export class RecurrencyPage {

  constructor() {}

} 