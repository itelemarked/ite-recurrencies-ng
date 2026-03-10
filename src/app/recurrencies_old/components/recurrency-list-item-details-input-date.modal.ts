import { Component, inject, input, signal, WritableSignal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { IonButton, IonButtons, IonContent, IonDatetime, IonHeader, IonIcon, IonItem, IonList, IonTitle, IonToolbar, ModalController } from '@ionic/angular/standalone';

import { DATE_FORMAT } from '../../../js/timezone-date/types/DateFormat';
import { DateString } from '../../../js/timezone-date/types/DateString';
import { Timezone } from '../../../js/timezone-date/types/Timezone';
import { SHORT_BEFORE_MIDNIGHT } from '../../../js/timezone-date/const/const';
import { TimezoneDate9 } from '../js/TimezoneDate9';


@Component({
  selector: 'app-recurrency-list-item-details-input-date',
  standalone: true,
  imports: [
    FormsModule, IonHeader, IonToolbar, IonButtons, IonButton, IonIcon, IonTitle, IonContent, IonDatetime, IonList
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
          <ion-button (click)="onCancelClick()">Cancel</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content [forceOverscroll]="false">
      
      <!-- <div class="flex justify-center">
        <ion-datetime
          presentation="date"
          [firstDayOfWeek]="1"
          [value]="state.currentDateString()"
          (ionChange)="onValueChange($event)"
        />
      </div>
      <p>currentDateString: {{ state.currentDateString() }}</p> -->

      <ion-list [inset]="true">
        <ion-datetime
          presentation="date"
          [firstDayOfWeek]="1"
          [value]="state.currentDateString()"
          (ionChange)="onValueChange($event)"
        />
      </ion-list>

    </ion-content>
  `,
  styles: [``],
})
export class RecurrencyListItemDetailsInputDateComponent {
  // DEPENDENCIES
  private modalCtrl = inject(ModalController)

  // STATE
  modalTitle = input.required<string>()
  inputValue = input.required<TimezoneDate9 | null>()
  timezone = input.required<Timezone>()
  state!: {
    currentDateString: WritableSignal<DateString>
  }

  // ACTIONS
  ngOnInit() {
    this.state = {
      currentDateString: signal(
        this.inputValue() === null
        ? TimezoneDate9.now(this.timezone()).format(DATE_FORMAT.DATE_STRING) as DateString
        : this.inputValue()!.format(DATE_FORMAT.DATE_STRING) as DateString
      )
    }
  }

  onBackButtonClick = () => {
    const timezoneDate = TimezoneDate9.create(this.state.currentDateString(), SHORT_BEFORE_MIDNIGHT, this.timezone())
    this.modalCtrl.dismiss(timezoneDate)
  }

  onCancelClick = () => {
    this.modalCtrl.dismiss(this.inputValue())
  }

  onValueChange(e: any) {
    this.state.currentDateString.set(e.detail.value)
  }
}
