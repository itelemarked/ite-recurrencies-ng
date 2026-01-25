import { Component, computed, inject, input, signal } from '@angular/core';
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
  IonText,
  IonTitle,
  IonToolbar,
  ModalController,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { chevronBackOutline, closeCircleOutline } from 'ionicons/icons';

import { DateFormat } from '../../../js/timezone-date/types/DateFormat';
import { Timezone } from '../../../js/timezone-date/types/Timezone';
import { PeriodUnit } from '../../../js/timezone-date/types/PeriodUnit.type';
import { TimezoneDate } from '../../../js/timezone-date/TimezoneDate';
import { slideInLeft, slideInRight } from '../../../js/ionic/animations/modals/slide-in';

import { Recurrency } from '../types/Recurrency.type';
import { PositiveInteger } from '../types/PositiveInteger.type';
import { RecurrencyListItemDetailsInputTextModal } from './recurrency-list-item-details-input-text.modal';
import { RecurrencyListItemDetailsInputDateComponent } from './recurrency-list-item-details-input-date.modal';


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
    IonIcon,
    IonText
],
  template: `
    <ion-header collapse="fade" [translucent]="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button (click)="onBackButtonClick()">
            <ion-icon name="chevron-back-outline"></ion-icon>
          </ion-button>
        </ion-buttons>
        <ion-title>{{ modalTitle() }}</ion-title>
        <ion-buttons slot="end">
          <ion-button (click)="onCancelClick()">
            Cancel
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content [forceOverscroll]="false">
      <ion-list [inset]="true">
        <ion-item [button]="true" (click)="onItemTitleClick()">
          <ion-label [color]="titleColor()">Title</ion-label>
          <ion-note [color]="titleColor()">{{ title() }}</ion-note>
        </ion-item>
        <ion-item [button]="true" (click)="onItemLastEventClick()">
          <ion-label [color]="lastEventColor()">Last Event</ion-label>
          <ion-note [color]="lastEventColor()">{{ lastEvent() }}</ion-note>
        </ion-item>
        <ion-item [button]="true">
          <ion-label [color]="periodColor()">Period</ion-label>
          <ion-note [color]="periodColor()">{{ period() }}</ion-note>
        </ion-item>
        <ion-item [button]="true">
          <ion-label [color]="expiryColor()">Expiry</ion-label>
          <ion-note [color]="expiryColor()">{{ expiry() }}</ion-note>
        </ion-item>
        <ion-item [button]="true">
          <ion-label [color]="categoryColor()">Category</ion-label>
          <ion-note [color]="categoryColor()">{{ category() }}</ion-note>
        </ion-item>
      </ion-list>
        @if (someErrors() && state.showErrors()) {
        <p class="ml-xl text-xs">
          <ion-text color="danger">Update the missing fields!</ion-text>
        </p>
        }
    </ion-content>
  `,
  styles: [``],
})
export class RecurrencyListItemDetailsModal {
  // DEPENDENCIES
  private modalCtrl = inject(ModalController)

  // STATE
  data = input.required<{ 
    type: 'create'
    timezone: Timezone,
    dateFormat: DateFormat
  }
  | {
    type: 'edit',
    recurrency: Recurrency,
    timezone: Timezone,
    dateFormat: DateFormat
  }>()

  state = {
    title: signal<string | null>(null),
    lastEvent: signal<TimezoneDate | null>(null),
    periodNb: signal<PositiveInteger | null>(null),
    periodUnit: signal<PeriodUnit | null>(null),
    category: signal<string | null>(null),

    showErrors: signal<boolean>(false),
  }

  // SELECTORS
  modalTitle = computed(() => this.data().type === 'edit' ? 'Edit Recurrency' : 'Create New Recurrency')
  title = computed(() => this.state.title() === null ? '-----' : this.state.title())
  lastEvent = computed(() => this.state.lastEvent() === null ? '-----' : this.state.lastEvent()!.format(this.data().dateFormat))
  period = computed(() => this.state.periodNb() === null || this.state.periodUnit() === null ? '-----' : `${this.state.periodNb()} ${this.state.periodUnit()}`)
  expiry = computed(() => this.state.lastEvent() === null || this.state.periodNb() === null || this.state.periodUnit() === null 
    ? '-----'
    : this.state.lastEvent()!.add(this.state.periodNb()!, this.state.periodUnit()!).format(this.data().dateFormat)
  )
  category = computed(() => this.state.category() === null ? '-----' : this.state.category())

  titleColor = computed(() => this.state.title() === null && this.state.showErrors() === true ? 'danger' : undefined)
  lastEventColor = computed(() => this.state.lastEvent() === null && this.state.showErrors() === true ? 'danger' : undefined)
  periodColor = computed(() => (this.state.periodNb() === null || this.state.periodUnit() === null) && this.state.showErrors() === true ? 'danger' : undefined)
  expiryColor = computed(() => (this.state.lastEvent() === null || this.state.periodNb() === null || this.state.periodUnit() === null) && this.state.showErrors() ? 'danger' : undefined)
  categoryColor = computed(() => this.state.category() === null && this.state.showErrors() === true ? 'danger' : undefined)

  someErrors = computed(() => (
    this.state.title() === null
    || this.state.lastEvent() === null
    || this.state.periodNb() === null
    || this.state.periodUnit() === null
    || this.state.category() === null
  ))

  constructor() {
    addIcons({
      chevronBackOutline,
      closeCircleOutline
    })
  }

  ngOnInit() {
    const data = this.data()

    this.state.title.set(data.type === 'edit' ? data.recurrency.title : null)
    this.state.lastEvent.set(data.type === 'edit' ? data.recurrency.lastEvent : null)
    this.state.periodNb.set(data.type === 'edit' ? data.recurrency.periodNb : null)
    this.state.periodUnit.set(data.type === 'edit' ? data.recurrency.periodUnit : null)
    this.state.category.set(data.type === 'edit' ? data.recurrency.category : null)
  }
  
  async onItemTitleClick() {
    const modal = await this.modalCtrl.create({
      component: RecurrencyListItemDetailsInputTextModal,
      componentProps: {
        modalTitle: 'Edit Title',
        inputValue: this.state.title()
      },
      enterAnimation: slideInLeft,
      leaveAnimation: slideInRight
    });
    modal.present()
    const outputValue = (await modal.onWillDismiss()).data! as string | null
    this.state.title.set(outputValue)
  }

  async onItemLastEventClick() {
    const modal = await this.modalCtrl.create({
      component: RecurrencyListItemDetailsInputDateComponent,
      componentProps: {
        modalTitle: 'Edit Last Event',
        inputValue: this.state.lastEvent(),
        timezone: this.data().timezone
      },
      enterAnimation: slideInLeft,
      leaveAnimation: slideInRight
    })
    modal.present()
    const timezoneDate = (await modal.onWillDismiss()).data! as TimezoneDate | null
    this.state.lastEvent.set(timezoneDate)
  }
  
  onBackButtonClick() {
    if(this.someErrors()) {
      this.state.showErrors.set(true)
    } else {
      this.modalCtrl.dismiss({
        title: this.state.title,
        lastEvent: this.state.lastEvent,
        periodNb: this.state.periodNb,
        periodUnit: this.state.periodUnit,
        category: this.state.category
      })
    }
  }

  onCancelClick() {
    this.modalCtrl.dismiss(null)
  }


  // PRIVATE

}
