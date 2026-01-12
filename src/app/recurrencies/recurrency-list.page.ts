import { Component, computed, inject, Signal, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

import { addIcons } from 'ionicons';
import { ellipsisHorizontalOutline } from 'ionicons/icons';
import {
  createAnimation,
  IonActionSheet,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonTitle,
  IonToolbar,
  ModalController,
} from '@ionic/angular/standalone';

import { blurActiveElement } from '../../js/ionic-fixes';
import { TIMEZONE } from './types/Timezone';
import { DATE_FORMAT } from './types/DateFormat';
import { Recurrency } from './types/Recurrency.type';

import { RecurrencyMockService } from './services/recurrency-mock.service';

import { RecurrencyListItemDetailsModal } from './components/recurrency-list-item-details.modal';
import { RecurrencyListComponent } from './components/recurrency-list.component';


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
  standalone: true,
  imports: [
    CommonModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonButtons,
    IonButton,
    IonIcon,
    IonActionSheet,
    RecurrencyListComponent
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
        <app-recurrency-list
          [recurrencies]="recurrencyList.recurrencies()"
          [sortBy]="recurrencyList.sortBy()"
          [timezone]="timezone"
          [dateFormat]="dateFormat"
          (itemTap)="onItemTap($event)"
          (deleteTap)="onDeleteTap($event)"
          (todayTap)="onTodayTap($event)"
        />
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
    sortBy: signal<'title' | 'expiry'>('expiry'),
    recurrencies: computed(() => this.recurrencyService.recurrencies())
  };

  listActions: any = {
    isOpen: signal(false),
    buttons: [
      {
        text: 'Add Item',
        handler: this.onAddItemClicked.bind(this),
      },
      {
        text: 'Filter by "Title"',
        handler: this.onFilterByTap('title').bind(this),
      },
      {
        text: 'Filter by "Expiry"',
        handler: this.onFilterByTap('expiry').bind(this),
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

  ngOnInit() {

  }

  onMenuButtonClick() {
    blurActiveElement();
    this.listActions.isOpen.set(true);
  }

  onItemTap(recurrency: Recurrency) {
    this._openDetailsModal({
      modalTitle: 'Edit',
      data: {
        recurrency,
        timezone: this.timezone,
        dateFormat: this.dateFormat
      }
    })
  }

  // TODO
  onDeleteTap(recurrency: Recurrency) {
    console.log('onDeleteTap()')
  }
  
  // TODO
  onTodayTap(recurrency: Recurrency) {
    console.log('onTodayTap()')
  }

  onAddItemClicked() {
    this._openDetailsModal({
      modalTitle: 'Create',
    })
  }

  onFilterByTap(filter: 'title' | 'expiry') {
    return () => this.recurrencyList.sortBy.set(filter)
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

