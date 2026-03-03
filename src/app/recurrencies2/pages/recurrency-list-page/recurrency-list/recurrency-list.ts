import { Component, computed, input, output } from '@angular/core';
import { IonicModule } from '@ionic/angular';

import { Recurrency } from '../../../types/Recurrency';

@Component({
  selector: 'app-recurrency-list',
  standalone: true,
  imports: [IonicModule],
  template: `
    @if (recurrencies().length === 0) {
      <ion-list [inset]="true">
        <ion-item>
          <ion-label>No recurrencies yet...</ion-label>
          <ion-button slot="end" size="small" (click)="addOutput.emit()">Add</ion-button>
        </ion-item>
      </ion-list>
    } @else {
      <ion-list [inset]="true">
        @for (recurrency of recurrencies(); track recurrency.uid) {
          <ion-item-sliding #slidingItem>
            <ion-item-options side="start">
              <ion-item-option color="primary">
                <ion-button size="small" (click)="onTodayTap(recurrency.uid)"> Today </ion-button>
              </ion-item-option>
            </ion-item-options>

            <ion-item [button]="true" (click)="onItemTap(recurrency.uid)">
              <ion-label>
                <h2>
                  <strong>{{ recurrency.title }}</strong>
                </h2>
                <!-- <p style="font-size: 0.8em;">Expiry: {{ expiryString(recurrency) }}</p> -->
              </ion-label>
              <!-- <ion-note slot="end" style="font-size: 0.8em;">{{ daysLeft(recurrency) }}</ion-note> -->
            </ion-item>

            <ion-item-options side="end">
              <ion-item-option color="danger">
                <ion-icon
                  slot="icon-only"
                  name="trash"
                  (click)="onRemoveTap(recurrency.uid)"
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
  addOutput = output<void>({ alias: 'add' });
  removeOutput = output<string>({ alias: 'remove' });
  editOutput = output<string>({ alias: 'edit' });
  todayOutput = output<void>({ alias: 'today' });
  

  // SELECTORS
  protected recurrencies = computed(() => this.recurrenciesInput())

  // ACTIONS
  protected onTodayTap = (uid: string) => {}
  protected onItemTap = (uid: string) => {}
  protected onRemoveTap = (uid: string) => {}

  // PRIVATE
}
