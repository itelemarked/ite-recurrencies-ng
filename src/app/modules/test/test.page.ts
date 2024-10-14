import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonButtons,
  IonModal,
  IonDatetime,
  IonInput,
  IonList,
  IonItem,
  IonIcon,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-test',
  standalone: true,
  imports: [
    FormsModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButton,
    IonButtons,
    IonModal,
    IonDatetime,
    IonInput,
    IonList,
    IonItem,
    IonIcon
  ],
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>TestPage</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content [forceOverscroll]="false">
  

   
    </ion-content>
  `,
  styles: ``,
})
export class TestPage {

  constructor() {}
}
