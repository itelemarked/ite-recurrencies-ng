import { Component, computed, input, output, viewChild } from '@angular/core';
import { addIcons } from 'ionicons';
import { trash } from 'ionicons/icons';
import { Recurrency } from '../types/Recurrency.type';
import { groupBy } from '../../../js/array';
import {
  IonList,
  IonButton,
  IonIcon,
  IonItem,
  IonItemOption,
  IonItemOptions,
  IonItemSliding,
  IonLabel,
  IonNote,
} from '@ionic/angular/standalone';
import { DateFormat } from '../../../js/timezone-date/types/DateFormat';
import { Timezone } from '../../../js/timezone-date/types/Timezone';

import { PERIOD_UNIT } from '../../../js/timezone-date/types/PeriodUnit.type';

@Component({
  selector: 'app-recurrency-list',
  standalone: true,
  imports: [
    IonList,
    IonItem,
    IonLabel,
    IonNote,
    IonItemSliding,
    IonItemOptions,
    IonItemOption,
    IonIcon,
    IonButton,
  ],
  template: `
    @for(category of categories(); track category) {
    <label class="list-header">{{ category }}</label>
    <ion-list #listEl class="with-list-header" [inset]="true">
      @for( recurrency of groupedRecurrencies()[category]; track recurrency.uid
      ) {
      <ion-item-sliding #slidingItem>
        <ion-item-options side="start">
          <ion-item-option color="primary">
            <ion-button size="small" (click)="onTodayTap(recurrency)">
              Today
            </ion-button>
            <!-- <ion-icon slot="icon-only" name="trash" (click)="slidingItem.close(); delete.emit()"></ion-icon> -->
          </ion-item-option>
        </ion-item-options>

        <ion-item [button]="true" (click)="onItemTap(recurrency)">
          <ion-label>
            <h2>
              <strong>{{ recurrency.title }}</strong>
            </h2>
            <p style="font-size: 0.8em;">
              Expiry: {{ expiryString(recurrency) }}
            </p>
          </ion-label>
          <ion-note slot="end" style="font-size: 0.8em;">{{
            daysLeft(recurrency)
          }}</ion-note>
        </ion-item>

        <ion-item-options side="end">
          <ion-item-option color="danger">
            <ion-icon
              slot="icon-only"
              name="trash"
              (click)="onDeleteTap(recurrency)"
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
export class RecurrencyListComponent {
  listEl = viewChild('listEl', { read: IonList });

  recurrencies = input.required<Recurrency[]>();
  dateFormat = input.required<DateFormat>();
  timezone = input.required<Timezone>();
  sortBy = input.required<'title' | 'expiry'>();

  deleteTap = output<Recurrency>();
  todayTap = output<Recurrency>();
  itemTap = output<Recurrency>();

  groupedRecurrencies = computed(() => {
    const sortFn = {
      title: (a: Recurrency, b: Recurrency) => (a.title < b.title ? -1 : 1),
      expiry: (a: Recurrency, b: Recurrency) =>
        this._getExpiryDate(a).toDate().valueOf() - this._getExpiryDate(b).toDate().valueOf(),
    }[this.sortBy()];
    const sortedRecurrencies = this.recurrencies().toSorted(sortFn);
    return groupBy<Recurrency>(sortedRecurrencies, ({ category }) => category);
  });

  categories = computed(() => Object.keys(this.groupedRecurrencies()));

  constructor() {
    addIcons({ trash });
  }

  // TODO: not ideal with method... use pipe instead???
  expiryString(recurrency: Recurrency) {
    // return format(
    //   this._getExpiryDate(recurrency),
    //   this.dateFormat(),
    //   this.timezone()
    // );
    return this._getExpiryDate(recurrency).format(this.dateFormat())
  }

  // TODO: not ideal with method... use pipe instead???
  daysLeft(recurrency: Recurrency) {
    // const expiryDate = this._getExpiryDate(recurrency);
    // const todayDate = endOf(new Date(), PERIOD_UNIT.DAYS, this.timezone());
    // const difference = diff(expiryDate, todayDate, PERIOD_UNIT.DAYS);
    // return difference < 0
    //   ? 'expired...'
    //   : difference.toString() + ' ' + 'days' + ' left';

    const differenceInDays = this._getExpiryDate(recurrency).diffToNow(PERIOD_UNIT.DAYS)
    return differenceInDays < 0
      ? 'expired...'
      : differenceInDays.toString() + ' ' + 'days' + ' left';
  }

  onDeleteTap(recurrency: Recurrency) {
    this.listEl()!.closeSlidingItems();
    this.deleteTap.emit(recurrency);
  }

  onTodayTap(recurrency: Recurrency) {
    this.listEl()!.closeSlidingItems();
    this.todayTap.emit(recurrency);
  }

  onItemTap(recurrency: Recurrency) {
    this.listEl()!.closeSlidingItems();
    this.itemTap.emit(recurrency);
  }

  private _getExpiryDate(recurrency: Recurrency) {
    return recurrency.lastEvent.add(recurrency.periodNb, recurrency.periodUnit)
    // const lastEventDate = createTimezoneDate({
    //   dateString: recurrency.lastEvent,
    //   timeString: SHORT_BEFORE_MIDNIGHT,
    //   timezone: TIMEZONE.ZURICH,
    // });
    // const expiryDate = endOf(
    //   add(lastEventDate, recurrency.periodNb, recurrency.periodUnit),
    //   recurrency.periodUnit,
    //   TIMEZONE.ZURICH
    // );
    // return expiryDate;
  }
}
