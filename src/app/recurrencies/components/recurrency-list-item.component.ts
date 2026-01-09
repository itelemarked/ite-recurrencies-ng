import { Component, computed, input, output } from '@angular/core';
import {
  IonButton,
  IonIcon,
  IonItem,
  IonItemOption,
  IonItemOptions,
  IonItemSliding,
  IonLabel,
  IonNote,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { trash } from 'ionicons/icons';
import { Recurrency } from '../types/Recurrency.type';
import { add, createTimezoneDate, diff, endOf, format } from '../utils/date';
import { TimeString } from '../types/TimeString';
import { Timezone, TIMEZONE } from '../types/Timezone';
import { PERIOD_UNIT } from '../types/PeriodUnit.type';
import { DateFormat } from '../types/DateFormat';


@Component({
  selector: 'recurrency-list-item',
  standalone: true,
  imports: [
    IonItem,
    IonLabel,
    IonNote,
    IonItemSliding,
    IonItemOptions,
    IonItemOption,
    IonIcon,
    IonButton
  ],
  template: `
    <ion-item-sliding #slidingItem>
      <ion-item-options side="start">
        <ion-item-option color="primary">
          <ion-button size="small" (click)="slidingItem.close();">Today</ion-button>
          <!-- <ion-icon slot="icon-only" name="trash" (click)="slidingItem.close(); delete.emit()"></ion-icon> -->
        </ion-item-option>
      </ion-item-options>

      <ion-item [button]="true">
        <ion-label>
          <strong>{{ recurrency().title }}</strong>
          <p style="font-size: 0.8em;">Expires: {{ expiry() }}</p>
        </ion-label>
        <ion-note slot="end" style="font-size: 0.8em;">{{ daysLeft() }}</ion-note>
      </ion-item>

      <ion-item-options side="end">
        <ion-item-option color="danger">
          <ion-icon slot="icon-only" name="trash" (click)="slidingItem.close(); delete.emit()"></ion-icon>
        </ion-item-option>
      </ion-item-options>
    </ion-item-sliding>
  `,
  styles: ``,
})
export class RecurrencyListItemComponent {
  recurrency = input.required<Recurrency>()
  dateFormat = input.required<DateFormat>()
  timezone = input.required<Timezone>()
  
  delete = output()

  expiry = computed(() => {
    return format(this._getExpiryDate(), this.dateFormat(), this.timezone())
  })

  daysLeft = computed(() => {
    const expiryDate = this._getExpiryDate()
    const todayDate = endOf(new Date(), PERIOD_UNIT.DAYS, this.timezone())
    const difference = diff(expiryDate, todayDate, PERIOD_UNIT.DAYS)
    return difference < 0 ? 'expired...' : difference.toString() + ' ' + 'days' + ' left'
  })

  constructor() {
    addIcons({trash})
  }

  private _getExpiryDate() {
    const recurrency = this.recurrency()
    const lastEventDate = createTimezoneDate({
      dateString: recurrency.lastEvent, 
      timeString: '23:59:59.999' as TimeString, 
      timezone: TIMEZONE.ZURICH
    })
    const expiryDate = endOf( add(lastEventDate, recurrency.periodNb, recurrency.periodUnit) , recurrency.periodUnit, TIMEZONE.ZURICH)
    return expiryDate
  }
}


