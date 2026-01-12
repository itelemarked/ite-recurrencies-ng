import { Component, computed, inject, Input, input } from '@angular/core';
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonNote,
  IonTitle,
  IonToolbar,
  ModalController,
} from '@ionic/angular/standalone';
import { Recurrency } from '../types/Recurrency.type';
import { DateFormat } from '../types/DateFormat';
import { Timezone } from '../types/Timezone';
import { add, createTimezoneDate, format, SHORT_BEFORE_MIDNIGHT } from '../../../js/date';
import { blurActiveElement } from '../../../js/ionic-fixes';
import { InputTextModal } from './recurrency-list-item-details-input-text.modal';
import { slideInLeft, slideInRight } from '../recurrency-list.page';
import { addIcons } from 'ionicons';
import { chevronBackOutline, closeCircleOutline } from 'ionicons/icons';

@Component({
  selector: 'app-recurrency-list-item-details',
  standalone: true,
  imports: [
    IonHeader,
    IonToolbar,
    IonButtons,
    IonButton,
    IonTitle,
    IonContent,
    IonList,
    IonItem,
    IonLabel,
    IonNote,
    IonIcon
  ],
  template: `
    <ion-header collapse="fade" [translucent]="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button (click)="onBackButtonClick()">
            <ion-icon name="chevron-back-outline"></ion-icon>
          </ion-button>
        </ion-buttons>
        <ion-title>{{ modalTitle }}</ion-title>
        <ion-buttons slot="end">
          <ion-button (click)="onBackButtonClick()">
            <ion-icon name="close-circle-outline" color="danger"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content [forceOverscroll]="false">
      <ion-list [inset]="true">
        <ion-item [button]="true" (click)="onItemTitleClick()">
          <ion-label>Title</ion-label>
          <ion-note>{{ title() }}</ion-note>
        </ion-item>
        <ion-item [button]="true">
          <ion-label>Last Event</ion-label>
          <ion-note>{{ lastEventString() }}</ion-note>
        </ion-item>
        <ion-item [button]="true">
          <ion-label>Period Nb</ion-label>
          <ion-note>{{ periodNb() }}</ion-note>
        </ion-item>
        <ion-item [button]="true">
          <ion-label>Period Unit</ion-label>
          <ion-note>{{ periodUnit() }}</ion-note>
        </ion-item>
        <ion-item [button]="true">
          <ion-label>Expiry</ion-label>
          <ion-note>{{ expiryString() }}</ion-note>
        </ion-item>
        <ion-item [button]="true">
          <ion-label>Category</ion-label>
          <ion-note>{{ category() }}</ion-note>
        </ion-item>
      </ion-list>
    </ion-content>
  `,
  styles: [``],
})
export class RecurrencyListItemDetailsModal {
  private modalCtrl = inject(ModalController)

  @Input({ required: true }) modalTitle!: string;
  @Input() data?: {
    recurrency: Recurrency,
    dateFormat: DateFormat,
    timezone: Timezone
  }

  title = computed(() => this.data === undefined ? '-----' : this.data.recurrency.title)
  periodNb = computed(() => this.data === undefined ? '-----' : this.data.recurrency.periodNb)
  periodUnit = computed(() => this.data  === undefined ? '-----' : this.data.recurrency.periodUnit)
  category = computed(() => this.data  === undefined ? '-----' : this.data.recurrency.category)
  lastEventString = computed(() => (
    this.data  === undefined ? 
    '-----' : 
    format(
      createTimezoneDate({
        dateString: this.data.recurrency.lastEvent,
        timeString: SHORT_BEFORE_MIDNIGHT,
        timezone: this.data.timezone
      }),
      this.data.dateFormat,
      this.data.timezone
    )
  ))
  expiryString = computed(() => (
    this.data  === undefined ? 
    '-----' : 
    format(
      add(
        createTimezoneDate({
          dateString: this.data.recurrency.lastEvent,
          timeString: SHORT_BEFORE_MIDNIGHT,
          timezone: this.data.timezone
        }),
        this.data.recurrency.periodNb,
        this.data.recurrency.periodUnit
      ),
      this.data.dateFormat,
      this.data.timezone
    )
  ))

  constructor() {
    addIcons({
      chevronBackOutline,
      closeCircleOutline
    })
  }
  
  onBackButtonClick() {
    // TODO: update data and role
    this.modalCtrl.dismiss('has-been-dismissed')
  }

  async onItemTitleClick() {
    blurActiveElement()
    const modal = await this.modalCtrl.create({
      component: InputTextModal,
      componentProps: {
        modalTitle: 'Title',
        data: this.data === undefined ? undefined : this.data.recurrency.title
      },
      enterAnimation: slideInLeft,
      leaveAnimation: slideInRight
    });
    modal.present();
    const { data, role } = await modal.onWillDismiss();
    console.log(data)
  }

}
