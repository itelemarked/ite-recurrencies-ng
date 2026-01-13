import { Component, computed, inject, Input, input, Optional, signal, Signal } from '@angular/core';
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
import { PeriodUnit } from '../types/PeriodUnit.type';
import { DateString } from '../types/DateString.type';


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

  // title: string | undefined
  // lastEvent: DateString | undefined
  // periodNb: number | undefined
  // periodUnit: PeriodUnit | undefined
  // category: string | undefined

  currentRecurrency!: Signal<Partial<Recurrency>>
  dataValueHasChanged!: boolean

  displayTitle = computed(() => {
    const title = this.currentRecurrency().title
    return title === undefined ? '-----' : title
  })

  displayLastEvent = computed(() => {
    const lastEvent = this.currentRecurrency().lastEvent
    return lastEvent === undefined ? '-----' : lastEvent
  })

  displayPeriodNb = computed(() => {
    const periodNb = this.currentRecurrency().periodNb
    return periodNb === undefined ? '-----' : periodNb
  })

  displayPeriodUnit = computed(() => {
    const periodUnit = this.currentRecurrency().periodUnit
    return periodUnit === undefined ? '-----' : periodUnit
  })


  displayExpiry = computed(() => {
    return '--expiry--'
  })

  displayCategory = computed(() => {
    const category = this.currentRecurrency().category
    return category === undefined ? '-----' : category
  })


  constructor() {
    addIcons({
      chevronBackOutline,
      closeCircleOutline
    })
  }

  ngOnInit() {
    this.currentRecurrency = signal({
      title: this.data === undefined ? undefined : this.data.recurrency.title,
      lastEvent: this.data === undefined ? undefined : this.data.recurrency.lastEvent,
      periodNb: this.data === undefined ? undefined : this.data.recurrency.periodNb,
      periodUnit: this.data === undefined ? undefined : this.data.recurrency.periodUnit,
      category: this.data === undefined ? undefined : this.data.recurrency.category,
    })
    // this.title = this.data === undefined ? '-----' : this.data.recurrency.title
    // this.periodNbString = this.data === undefined ? '-----' : this.data.recurrency.periodNb.toString()
    // this.periodUnit = this.data  === undefined ? '-----' : this.data.recurrency.periodUnit
    // this.category = this.data  === undefined ? '-----' : this.data.recurrency.category
    // this.lastEventString = this.data  === undefined ? 
    //   '-----' : 
    //   format(
    //     createTimezoneDate({
    //       dateString: this.data.recurrency.lastEvent,
    //       timeString: SHORT_BEFORE_MIDNIGHT,
    //       timezone: this.data.timezone
    //     }),
    //     this.data.dateFormat,
    //     this.data.timezone
    //   )
    // this.expiryString = this.data  === undefined ? 
    //   '-----' : 
    //   format(
    //     add(
    //       createTimezoneDate({
    //         dateString: this.data.recurrency.lastEvent,
    //         timeString: SHORT_BEFORE_MIDNIGHT,
    //         timezone: this.data.timezone
    //       }),
    //       this.data.recurrency.periodNb,
    //       this.data.recurrency.periodUnit
    //     ),
    //     this.data.dateFormat,
    //     this.data.timezone
    //   )
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
        data: this.data === undefined ? undefined : this.data.recurrency.title
      },
      enterAnimation: slideInLeft,
      leaveAnimation: slideInRight
    });
    modal.present();
    const { data }= await modal.onWillDismiss();
    // this.title = data.trim() === '' || data === undefined ? '-----' : data
    // this.dataValueHasChanged = this.title === '-----'
  }

  private _isRecurrencyValid() {}

  private _isRecurrencySameAsOriginalInput() {}

}
