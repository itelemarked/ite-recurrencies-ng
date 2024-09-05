import { Component } from '@angular/core';
import { IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonTitle, IonToolbar, ModalController } from '@ionic/angular/standalone';
import { RecurrencyListItemComponent } from './recurrency-list-item.component';
import { CommonModule } from '@angular/common';
import { Recurrency } from './Recurrency';
import { RecurrencyService } from './recurrency.service';
import { Observable } from 'rxjs';
import { addIcons } from 'ionicons';
import { addOutline } from 'ionicons/icons';
import { RecurrencyListItemEditModal } from './recurrency-list-item-edit.modal';

@Component({
  selector: 'app-recurrencies-list',
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonButtons, IonIcon, RecurrencyListItemComponent, CommonModule],
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>RecurrenciesListPage</ion-title>
        <ion-buttons slot="end">
          <!-- <ion-button (click)="onOpenEditModal()">
            <ion-icon slot="icon-only" name="add-outline"></ion-icon>
          </ion-button> -->
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content [forceOverscroll]="false">
      <!-- <div *ngFor="let recurrency of (recurrencies$ | async)">
        <app-recurrencies-list-item
          [recurrency]="recurrency"
          (edit)="onOpenEditModal(recurrency)"
          (delete)="onDelete(recurrency)"
        ></app-recurrencies-list-item>
      </div> -->
    </ion-content>
  `,
  styles: ``,
})
export class RecurrencyListPage {

  // recurrencies$: Observable<Recurrency[]>

  // constructor(private recurrencyService: RecurrencyService, private modalCtrl: ModalController) {
  //   addIcons({addOutline})
  //   this.recurrencies$ = this.recurrencyService.get$()
  // }

  // onDelete(recurrency: Recurrency) {
  //   this.recurrencyService.remove(recurrency)
  // }

  // onEdit() {
  //   console.log('onEdit!')
  // }

  // async onOpenEditModal(recurrency?: Recurrency) {
  //   const modal = await this.modalCtrl.create({
  //     component: RecurrencyListItemEditModal,
  //     componentProps: {recurrency}
  //   });
  //   modal.present();

  //   // const { data, role } = await modal.onWillDismiss();

  //   // if (role === 'confirm') {
  //   //   this.message = `Hello, ${data}!`;
  //   // }
  // }

}