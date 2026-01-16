import { Component, computed, inject, Input, input, Optional, signal, Signal, WritableSignal } from '@angular/core';
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
import { DateFormat } from '../../../js/timezone-date/types/DateFormat';
import { Timezone } from '../../../js/timezone-date/types/Timezone';
import { add, createTimezoneDate, format, SHORT_BEFORE_MIDNIGHT } from '../../../js/date';
import { blurActiveElement } from '../../../js/ionic-fixes';
import { InputTextModal } from './recurrency-list-item-details-input-text.modal';
import { slideInLeft, slideInRight } from '../recurrency-list.page';
import { addIcons } from 'ionicons';
import { chevronBackOutline, closeCircleOutline } from 'ionicons/icons';
import { PeriodUnit } from '../../../js/timezone-date/types/PeriodUnit.type';
import { DateString } from '../../../js/timezone-date/types/DateString.type';
import { TimezoneDate } from 'src/js/timezone-date/TimezoneDate';
import { PositiveInteger } from '../types/PositiveInteger.type';


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
          <ion-note>{{ displayTitle() }}</ion-note>
        </ion-item>
        <ion-item [button]="true">
          <ion-label>Last Event</ion-label>
          <ion-note>{{ displayLastEvent() }}</ion-note>
        </ion-item>
        <ion-item [button]="true">
          <ion-label>Period Nb</ion-label>
          <ion-note>{{ displayPeriodNb() }}</ion-note>
        </ion-item>
        <ion-item [button]="true">
          <ion-label>Period Unit</ion-label>
          <ion-note>{{ displayPeriodUnit() }}</ion-note>
        </ion-item>
        <ion-item [button]="true">
          <ion-label>Expiry</ion-label>
          <ion-note>{{ displayExpiry() }}</ion-note>
        </ion-item>
        <ion-item [button]="true">
          <ion-label>Category</ion-label>
          <ion-note>{{ displayCategory() }}</ion-note>
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

  title!: WritableSignal<string | null>
  lastEvent!: WritableSignal<TimezoneDate | null>
  periodNb!: WritableSignal<PositiveInteger | null>
  periodUnit!: WritableSignal<PeriodUnit | null>
  category!: WritableSignal<string | null>

  dataValueHasChanged!: boolean

  displayTitle = computed(() => this.title() === null ? '-----' : this.title())
  displayLastEvent = computed(() => this.lastEvent() === null ? '-----' : this.lastEvent()!.format(this.data!.dateFormat))
  displayPeriodNb = computed(() => this.periodNb() === null ? '-----' : this.periodNb())
  displayPeriodUnit = computed(() => this.periodUnit() === null ? '-----' : this.periodUnit())
  displayExpiry = computed(() => this.lastEvent() === null || this.periodNb() === null || this.periodUnit() === null 
    ? '-----'
    : this.lastEvent()!.add(this.periodNb()!, this.periodUnit()!).format(this.data!.dateFormat)
  )
  displayCategory = computed(() => this.category() === null ? '-----' : this.category())


  constructor() {
    addIcons({
      chevronBackOutline,
      closeCircleOutline
    })
  }

  ngOnInit() {
    this.title = signal(this.data === undefined ? null : this.data.recurrency.title)
    this.lastEvent = signal(this.data === undefined ? null : this.data.recurrency.lastEvent)
    this.periodNb = signal(this.data === undefined ? null : this.data.recurrency.periodNb)
    this.periodUnit = signal(this.data === undefined ? null : this.data.recurrency.periodUnit)
    this.category = signal(this.data === undefined ? null : this.data.recurrency.category)

    this.dataValueHasChanged = false
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
        data: this.title()
      },
      enterAnimation: slideInLeft,
      leaveAnimation: slideInRight
    });
    modal.present();
    // const result: {role: 'ok', data: string} | {role: 'cancel'} = await modal.onWillDismiss<{role: 'ok', data: string} | {role: 'cancel'}>();
    const { data, role } = await modal.onWillDismiss<string>();

    if(role === 'ok') {
      this.title.set(data === '' ? null : data!.trim())
    }
    // this.dataValueHasChanged = this.title === '-----'
  }

  private _isRecurrencyValid() {}

  private _isRecurrencySameAsOriginalInput() {}

}
