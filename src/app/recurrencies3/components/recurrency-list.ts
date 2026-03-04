import { Component, computed, input, output, viewChild } from '@angular/core';
import { IonicModule, IonItemSliding } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { trash } from 'ionicons/icons';

import { Recurrency } from '../types/Recurrency';
import { isTimezoneDate, TimezoneDate } from '../../../js/timezone-date/TimezoneDate';
import { SHORT_BEFORE_MIDNIGHT } from '../../../js/timezone-date/const/const';
import { Timezone } from '../../../js/timezone-date/types/Timezone';
import { DateFormat } from '../../../js/timezone-date/types/DateFormat';
import { PERIOD_UNIT } from '../../../js/timezone-date/types/PeriodUnit.type';


@Component({
  selector: 'app-recurrency-list',
  standalone: true,
  imports: [IonicModule],
  template: `
    @if (mappedRecurrencies().length === 0) {
      <ion-list [inset]="true">
        <ion-item>
          <ion-label>No recurrencies yet...</ion-label>
          <ion-button slot="end" size="small" (click)="onAddTap()">Add</ion-button>
        </ion-item>
      </ion-list>
    } 
    @else {
      <ion-list [inset]="true">
        @for (mappedRecurrency of mappedRecurrencies(); track mappedRecurrency.uid) {
          <ion-item-sliding #slidingItemEl (click)="slidingItemEl.close()">
            <ion-item-options side="start">
              <ion-item-option color="primary">
                <ion-button size="small" (click)="onTodayTap(mappedRecurrency.uid)"> Today </ion-button>
              </ion-item-option>
            </ion-item-options>

            <ion-item [button]="true" (click)="onItemTap(mappedRecurrency.uid)">
              <ion-label>
                <h2>
                  <strong>{{ mappedRecurrency.title }}</strong>
                </h2>
                <p style="font-size: 0.8em;">Expiry: {{ mappedRecurrency.expiryString }}</p>
              </ion-label>
              <ion-note slot="end" style="font-size: 0.8em;">{{ mappedRecurrency.daysLeftString }}</ion-note>
            </ion-item>

            <ion-item-options side="end">
              <ion-item-option color="danger">
                <ion-icon
                  slot="icon-only"
                  name="trash"
                  (click)="onRemoveTap(mappedRecurrency.uid)"
                ></ion-icon>
              </ion-item-option>
            </ion-item-options>
          </ion-item-sliding>
        }
      </ion-list>
    }
  `,
  styles: [``],
})
export class RecurrencyList {
  // DEPENDENCIES

  // STATE
  recurrenciesInput = input.required<Recurrency[]>({ alias: 'recurrencies' });
  timezoneInput = input.required<Timezone>({alias: 'timezone'})
  dateFormatInput = input.required<DateFormat>({alias: 'dateFormat'})

  addOutput = output<void>({ alias: 'add' });
  removeOutput = output<string>({ alias: 'remove' });
  editOutput = output<string>({ alias: 'edit' });
  todayOutput = output<string>({ alias: 'today' });
  

  // SELECTORS
  protected mappedRecurrencies = computed(() => {
    const recurrency = this.recurrenciesInput()
    const timezone = this.timezoneInput()
    const dateFormat = this.dateFormatInput()

    return recurrency.map(rec => {
      const expiryDate = TimezoneDate.create(rec.lastEvent, SHORT_BEFORE_MIDNIGHT, timezone)

      const expiryString = expiryDate
        .add(rec.periodNb, rec.periodUnit)
        .format(dateFormat)

      const numberOfDaysLeft = expiryDate.diffToNow(PERIOD_UNIT.DAYS)
      const daysLeftString = numberOfDaysLeft < 0 ? 'Expired...' : `${numberOfDaysLeft} day(s) left`

      return {...rec, expiryString, daysLeftString}
    })
  })

  // ACTIONS
  constructor() {
    addIcons({trash})
  }

  protected onAddTap = () => this.addOutput.emit()

  protected onTodayTap = (recurrencyUid: string | undefined) => {
    if(recurrencyUid !== undefined) {
      this.todayOutput.emit(recurrencyUid)
    }
  }

  protected onItemTap = (recurrencyUid: string | undefined) => {
    if(recurrencyUid !== undefined) {
      this.editOutput.emit(recurrencyUid)
    }
  }

  protected onRemoveTap = (recurrencyUid: string | undefined) => {
    if(recurrencyUid !== undefined) {
      this.removeOutput.emit(recurrencyUid)
    }
  }

  // PRIVATE
}
