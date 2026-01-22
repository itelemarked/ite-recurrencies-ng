import { Component, inject, input, signal, WritableSignal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonButton, IonButtons, IonContent, IonDatetime, IonHeader, IonIcon, IonItem, IonList, IonTitle, IonToolbar, ModalController } from '@ionic/angular/standalone';
import { SHORT_BEFORE_MIDNIGHT } from 'src/js/date';
import { TimezoneDate } from 'src/js/timezone-date/TimezoneDate';
import { DATE_FORMAT } from 'src/js/timezone-date/types/DateFormat';
import { DateString } from 'src/js/timezone-date/types/DateString.type';
import { Timezone } from 'src/js/timezone-date/types/Timezone';

@Component({
  selector: 'app-recurrency-list-item-details-input-date',
  standalone: true,
  imports: [
    FormsModule, IonHeader, IonToolbar, IonButtons, IonButton, IonIcon, IonTitle, IonContent, IonDatetime, 
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
      
      <div class="flex justify-center">
        <ion-datetime
          presentation="date"
          [firstDayOfWeek]="1"
          [value]="state.currentDateString()"
          (ionChange)="onValueChange($event)"
        />
      </div>
      <p>currentDateString: {{ state.currentDateString() }}</p>

    </ion-content>
  `,
  styles: [``],
})
export class RecurrencyListItemDetailsInputDateComponent {
  // DEPENDENCIES
  private modalCtrl = inject(ModalController)

  // STATE
  modalTitle = input.required<string>()
  inputValue = input.required<TimezoneDate | null>()
  timezone = input.required<Timezone>()
  state!: {
    currentDateString: WritableSignal<DateString>
  }

  // ACTIONS
  ngOnInit() {
    this.state = {
      currentDateString: signal(
        this.inputValue() === null
        ? TimezoneDate.now(this.timezone()).format(DATE_FORMAT.DATE_STRING) as DateString
        : this.inputValue()!.format(DATE_FORMAT.DATE_STRING) as DateString
      )
    }
  }

  onBackButtonClick = () => {
    const timezoneDate = TimezoneDate.create(this.state.currentDateString(), SHORT_BEFORE_MIDNIGHT, this.timezone())
    this.modalCtrl.dismiss(timezoneDate)
  }

  onCancelClick = () => {
    this.modalCtrl.dismiss(this.inputValue())
  }

  onValueChange(e: any) {
    this.state.currentDateString.set(e.detail.value)
  }
}
