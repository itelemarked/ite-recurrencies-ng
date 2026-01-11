import { Component, computed, inject, signal, viewChild } from '@angular/core';
import {
  createAnimation,
  IonActionSheet,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonList,
  IonTitle,
  IonToolbar,
  ModalController,
} from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';

import { RecurrencyListItemComponent } from './components/recurrency-list-item.component';
import { RecurrencyMockService } from './services/recurrency-mock.service';
import { addIcons } from 'ionicons';
import { ellipsisHorizontalOutline } from 'ionicons/icons';
import { groupBy } from './utils/array';
import { blurActiveElement } from './utils/ionic-fixes';
import { TIMEZONE } from './types/Timezone';
import { DATE_FORMAT } from './types/DateFormat';
import { Recurrency } from './types/Recurrency.type';
import { RecurrencyListItemDetailsModal } from './components/recurrency-list-item-details.modal';


export const slideInLeft = (baseEl: HTMLElement) => {
  const root = baseEl.shadowRoot;

  const backdropAnimation = createAnimation()
    backdropAnimation
    .addElement(root!.querySelector('ion-backdrop')!)
    .fromTo('opacity', '0.01', '1');

  const wrapperAnimation = createAnimation()
  wrapperAnimation
    .addElement(root!.querySelector('.modal-wrapper')!)
    .keyframes([
      { offset: 0, transform: 'translateX(100%)' },
      { offset: 1, transform: 'translateX(0)' },
    ]);

  return createAnimation()
    .addElement(baseEl)
    .easing('ease-out')
    .duration(200)
    .addAnimation([wrapperAnimation, backdropAnimation])
};

export const slideInRight = (baseEl: HTMLElement) => {
  const root = baseEl.shadowRoot;

  const backdropAnimation = createAnimation()
    backdropAnimation
    .addElement(root!.querySelector('ion-backdrop')!)
    .fromTo('opacity', '1', '0.01');

  const wrapperAnimation = createAnimation()
  wrapperAnimation
    .addElement(root!.querySelector('.modal-wrapper')!)
    .keyframes([
      { offset: 0, transform: 'translateX(0)' },
      { offset: 1, transform: 'translateX(100%)' },
    ]);

  return createAnimation()
    .addElement(baseEl)
    .easing('ease-out')
    .duration(200)
    .addAnimation([wrapperAnimation, backdropAnimation])
};



@Component({
  selector: 'app-recurrency-list',
  standalone: true,
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonList,
    IonButtons,
    IonButton,
    IonIcon,
    IonActionSheet,
    RecurrencyListItemComponent,
  ],
  template: `
    <ion-header collapse="fade" [translucent]="true">
      <ion-toolbar>
        <ion-title> RecurrencyList </ion-title>
        <ion-buttons slot="end">
          <ion-button (click)="onMenuButtonClick()">
            <ion-icon
              slot="icon-only"
              name="ellipsis-horizontal-outline"
            ></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content [forceOverscroll]="false">

      <div class="recurrencyList">
        @for(grouped of recurrencyList.groupedByCategory(); track grouped[0]) {
        <label style="margin-left: 16px; color: grey; font-weight: bold;">{{ grouped[0] }}</label>
        <ion-list [inset]="true" class="mt-sm">
          <!-- <ion-list-header>
            <ion-label>{{ grouped[0] }}</ion-label>
          </ion-list-header> -->
          @for( recurrency of grouped[1]; track recurrency.uid ) {
          <recurrency-list-item
            [recurrency]="recurrency"
            [timezone]="timezone"
            [dateFormat]="dateFormat"
            (click)="onItemClick(recurrency)"
          />
          }
        </ion-list>
        }
      </div>

      <div class="listActions">
        <ion-action-sheet
          [isOpen]="listActions.isOpen()"
          [buttons]="listActions.buttons"
          (willDismiss)="listActions.isOpen.set(false)"
        ></ion-action-sheet>
      </div>

    </ion-content>
  `,
  styles: [``],
})
export class RecurrencyListPage {
  private recurrencyService = inject(RecurrencyMockService);
  private modalCtrl = inject(ModalController)

  // TODO: replace by settingsservice
  timezone = TIMEZONE.ZURICH;
  dateFormat = DATE_FORMAT.CH;

  recurrencyList = {
    groupedByCategory: computed(() => {
      return groupBy(
        this.recurrencyService.recurrencies(),
        ({ category }) => category
      );
    }),
  };

  listActions: any = {
    isOpen: signal(false),
    buttons: [
      {
        text: 'Add Item',
        handler: this.onAddItemClicked.bind(this),
      },
      {
        text: 'Filter by "name"',
        handler: () => {
          // TODO
          console.log('filter by name clicked');
        },
      },
      {
        text: 'Filter by "days left"',
        handler: () => {
          // TODO
          console.log('filter by daysleft clicked');
        },
      },
      {
        text: 'Cancel',
        role: 'cancel',
      },
    ],
  };

  constructor() {
    addIcons({ ellipsisHorizontalOutline });
  }

  onMenuButtonClick() {
    blurActiveElement();
    this.listActions.isOpen.set(true);
  }

  onItemClick(recurrency: Recurrency) {
    this._openDetailsModal({
      modalTitle: 'Edit',
      data: {
        recurrency,
        timezone: this.timezone,
        dateFormat: this.dateFormat
      }
    })
  }

  onAddItemClicked() {
    this._openDetailsModal({
      modalTitle: 'Create',
    })
  }

  private async _openDetailsModal(componentProps: any) {
    blurActiveElement()
    const modal = await this.modalCtrl.create({
      component: RecurrencyListItemDetailsModal,
      componentProps,
      enterAnimation: slideInLeft,
      leaveAnimation: slideInRight
    });
    modal.present();
    const { data, role } = await modal.onWillDismiss();
    console.log(data)
  }
}

