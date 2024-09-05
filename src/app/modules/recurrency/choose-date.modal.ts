import { Component } from '@angular/core';
import { IonButton, IonButtons, IonDatetime, IonTitle, IonToolbar, ModalController } from '@ionic/angular/standalone';

@Component({
  selector: 'app-choose-date-modal',
  standalone: true,
  imports: [IonDatetime, IonToolbar, IonTitle, IonButtons, IonButton],
  template: `
    <div>
      <ion-toolbar>
        <ion-title>**Title**</ion-title>
      </ion-toolbar>
      <ion-datetime
        class="outline-top-bottom"
        [firstDayOfWeek]="1"
        presentation="date"
        size="cover"
      ></ion-datetime>
      <ion-toolbar>
        <ion-buttons>
          <ion-button class="center" (click)="onDismissModal('cancel')">Cancel</ion-button>
          <ion-button class="center" (click)="onDismissModal('today')">Today</ion-button>
          <ion-button class="center" (click)="onDismissModal('ok')">Ok</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </div>
  `,
  styles: `
    .center {
      flex: 1 1 0;
    }

    .outline-top-bottom {
      border-top: 1px solid var(--ion-color-medium);
      border-bottom: 1px solid var(--ion-color-medium);
    }
  `,
})
export class ChooseDateModal {

  constructor(private modalCtrl: ModalController) {}

  onDismissModal(role: 'cancel' | 'today' | 'ok') {
    this.modalCtrl.dismiss({}, role)
  }

}