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
import { blurActiveElement } from '../../../js/ionic/fixes';
import { InputTextModal } from './recurrency-list-item-details-input-text.modal';
import { addIcons } from 'ionicons';
import { chevronBackOutline, closeCircleOutline } from 'ionicons/icons';
import { PeriodUnit } from '../../../js/timezone-date/types/PeriodUnit.type';
import { TimezoneDate } from 'src/js/timezone-date/TimezoneDate';
import { PositiveInteger } from '../types/PositiveInteger.type';
import { slideInLeft, slideInRight } from 'src/js/ionic/animations/modals/slide-in';


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
        <ion-title>{{ displayModalTitle() }}</ion-title>
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
  // DEPENDENCIES
  private modalCtrl = inject(ModalController)

  // STATE
  @Input({ required: true }) data!: 
    | { 
      type: 'create'
      timezone: Timezone,
      dateFormat: DateFormat
    }
    | {
      type: 'edit',
      recurrency: Recurrency,
      timezone: Timezone,
      dateFormat: DateFormat
    };

  // data = input.required<
  //   { 
  //     type: 'create'
  //     timezone: Timezone,
  //     dateFormat: DateFormat
  //   }
  //   | {
  //     type: 'edit',
  //     recurrency: Recurrency,
  //     timezone: Timezone,
  //     dateFormat: DateFormat
  //   }
  //   >()
    
  // private state = {
  //   isEditMode: signal<boolean>(true),
  //   title: signal<string | null>(this.data.type === 'edit' ? this.data.recurrency.title : null),
  //   lastEvent: signal<TimezoneDate | null>(this.data.type === 'edit' ? this.data.recurrency.lastEvent : null),
  //   periodNb: signal<PositiveInteger | null>(this.data.type === 'edit' ? this.data.recurrency.periodNb : null),
  //   periodUnit: signal<PeriodUnit | null>(this.data.type === 'edit' ? this.data.recurrency.periodUnit : null),
  //   category: signal<string | null>(this.data.type === 'edit' ? this.data.recurrency.category : null),
  //   dataValueHasChanged: false
  // }
  private state!: any

  // SELECTORS
  displayModalTitle = computed(() => this.data.type === 'edit' ? 'Edit Recurrency' : 'Create New Recurrency')
  displayTitle = computed(() => this.state.title() === null ? '-----' : this.state.title())
  displayLastEvent = computed(() => this.state.lastEvent() === null ? '-----' : this.state.lastEvent()!.format(this.data!.dateFormat))
  displayPeriodNb = computed(() => this.state.periodNb() === null ? '-----' : this.state.periodNb())
  displayPeriodUnit = computed(() => this.state.periodUnit() === null ? '-----' : this.state.periodUnit())
  displayExpiry = computed(() => this.state.lastEvent() === null || this.state.periodNb() === null || this.state.periodUnit() === null 
    ? '-----'
    : this.state.lastEvent()!.add(this.state.periodNb()!, this.state.periodUnit()!).format(this.data!.dateFormat)
  )
  displayCategory = computed(() => this.state.category() === null ? '-----' : this.state.category())


  constructor() {
    addIcons({
      chevronBackOutline,
      closeCircleOutline
    })
  }

  ngOnInit() {
    this.state = {
      isEditMode: signal<boolean>(true),
      title: signal<string | null>(this.data.type === 'edit' ? this.data.recurrency.title : null),
      lastEvent: signal<TimezoneDate | null>(this.data.type === 'edit' ? this.data.recurrency.lastEvent : null),
      periodNb: signal<PositiveInteger | null>(this.data.type === 'edit' ? this.data.recurrency.periodNb : null),
      periodUnit: signal<PeriodUnit | null>(this.data.type === 'edit' ? this.data.recurrency.periodUnit : null),
      category: signal<string | null>(this.data.type === 'edit' ? this.data.recurrency.category : null),
      dataValueHasChanged: false
    }
  }
  
  onBackButtonClick() {
    // TODO: update data and role
    this.modalCtrl.dismiss('has-been-dismissed')
  }

  async onItemTitleClick() {
    // blurActiveElement()
    // const modal = await this.modalCtrl.create({
    //   component: InputTextModal,
    //   componentProps: {
    //     modalTitle: 'Title',
    //     data: this.title()
    //   },
    //   enterAnimation: slideInLeft,
    //   leaveAnimation: slideInRight
    // });
    // modal.present();
    // // const result: {role: 'ok', data: string} | {role: 'cancel'} = await modal.onWillDismiss<{role: 'ok', data: string} | {role: 'cancel'}>();
    // const { data, role } = await modal.onWillDismiss<string>();

    // if(role === 'ok') {
    //   this.title.set(data === '' ? null : data!.trim())
    // }
    // // this.dataValueHasChanged = this.title === '-----'
  }

  private _isRecurrencyValid() {}

  private _isRecurrencySameAsOriginalInput() {}

}
