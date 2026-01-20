
import { Component, inject, signal } from "@angular/core";
import { IonButton, IonContent, IonHeader, IonTitle, IonToolbar, ModalController } from "@ionic/angular/standalone";

import { DetailModalComponent } from "./detail.modal";

@Component({
  selector: 'app-testing-page',
  standalone: true,
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButton
],
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>
          Testing
        </ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content [forceOverscroll]="false">
      TestingPage works!

      <ion-button (click)="onBtnClick()">
        Click me
      </ion-button>

    </ion-content>
  `,
  styles: [``]
})
export class TestingPage {
  value = signal('abcd')
  private modalCtrl = inject(ModalController)

  onBtnClick = async () => {
    const modal = await this.modalCtrl.create({
      component: DetailModalComponent,
      componentProps: {
        value: this.value()
      }
    })
    modal.present()
  }

  constructor() {
    // setTimeout(() => {
    //   this.value.set('efgh')
    // }, 5000);
  }
}


