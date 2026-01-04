import { Component, computed, input, output } from '@angular/core';
import {
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
import { RecurrencyInterface } from '../types/RecurrencyInterface';
import { DATE_FORMAT } from '@app/_types/DateFormat';


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
  ],
  template: `
    <ion-item-sliding #slidingItem>
      <ion-item [button]="true">
        <ion-label>
          <strong>{{ recurrency().title }}</strong>
          <p>Expires: {{ expiry() }}</p>
        </ion-label>
        <ion-note slot="end">{{ daysLeft() }}</ion-note>
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
  recurrency = input.required<RecurrencyInterface>();
  delete = output()

  expiry = computed(() => this.recurrency().getExpiryDate().toString(DATE_FORMAT.CH) )
  daysLeft = computed(() => `${this.recurrency().getExpiryDate().diff('days')} days left...`)

  constructor() {
    addIcons({trash})
  }
}


