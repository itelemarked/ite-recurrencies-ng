import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { toNewRecurrency, toRecurrency } from '../../../features/recurrencies/recurrency.model';
import { RecurrencyService } from '../../recurrencies/recurrency.service';
import { PERIOD_UNITS, PeriodUnit, Recurrency } from '../../recurrencies/recurrency.types';

@Component({
  selector: 'app-recurrency-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IonicModule],
  template: `
      <ion-card-content>
        <!-- Top Add Button -->
        <ion-button
          size="small"
          color="primary"
          class="ion-margin-bottom"
          (click)="onAdd()"
        >
          add
        </ion-button>

        <!-- 5 Empty Input Fields for New Recurrency -->
        <ion-grid class="ion-no-padding ion-margin-bottom">
          <ion-row>
            <ion-col size="12" sizeMd="3">
              <ion-input
                label="Title"
                labelPlacement="stacked"
                fill="outline"
                [value]="newTitle()"
                (ionInput)="newTitle.set($any($event).detail.value ?? '')"
              />
            </ion-col>

            <ion-col size="12" sizeMd="2">
              <ion-input
                label="Last Event"
                labelPlacement="stacked"
                fill="outline"
                [value]="newLastEvent()"
                (ionInput)="newLastEvent.set($any($event).detail.value ?? '')"
              />
            </ion-col>

            <ion-col size="6" sizeMd="2">
              <ion-input
                type="number"
                label="Period Nb"
                labelPlacement="stacked"
                fill="outline"
                [value]="newPeriodNb()"
                (ionInput)="newPeriodNb.set($any($event).detail.value ?? '')"
              />
            </ion-col>

            <ion-col size="6" sizeMd="2">
              <ion-select
                label="Unit"
                labelPlacement="stacked"
                fill="outline"
                [value]="newPeriodUnit()"
                (ionChange)="newPeriodUnit.set($any($event).detail.value ?? '')"
              >
                @for (unit of periodUnits; track unit) {
                  <ion-select-option [value]="unit">{{ unit }}</ion-select-option>
                }
              </ion-select>
            </ion-col>

            <ion-col size="12" sizeMd="3">
              <ion-input
                label="Category"
                labelPlacement="stacked"
                fill="outline"
                [value]="newCategory()"
                (ionInput)="newCategory.set($any($event).detail.value ?? '')"
              />
            </ion-col>
          </ion-row>
        </ion-grid>

        <!-- Recurrencies List -->
        <ion-list lines="full" class="ion-margin-bottom">
          @for (item of recurrencyService.items(); track item.id) {
            <ion-item>
              <ion-grid class="ion-no-padding ion-padding-vertical">
                <ion-row class="ion-align-items-center">
                  <ion-col size="12" sizeMd="3">
                    <ion-input
                      label="Title"
                      labelPlacement="stacked"
                      fill="outline"
                      [value]="item.title"
                      (ionChange)="onUpdate(item.id, 'title', $any($event).detail.value)"
                    />
                  </ion-col>

                  <ion-col size="12" sizeMd="2">
                    <ion-input
                      type="text"
                      placeholder="yyyy-mm-dd"
                      label="Last Event"
                      labelPlacement="stacked"
                      fill="outline"
                      [value]="item.lastEvent"
                      (ionChange)="onUpdate(item.id, 'lastEvent', $any($event).detail.value)"
                    />
                  </ion-col>

                  <ion-col size="6" sizeMd="2">
                    <ion-input
                      type="number"
                      label="Period Nb"
                      labelPlacement="stacked"
                      fill="outline"
                      [value]="item.periodNb"
                      (ionChange)="onUpdate(item.id, 'periodNb', Number($any($event).detail.value))"
                    />
                  </ion-col>

                  <ion-col size="6" sizeMd="2">
                    <ion-select
                      label="Unit"
                      labelPlacement="stacked"
                      fill="outline"
                      [value]="item.periodUnit"
                      (ionChange)="onUpdate(item.id, 'periodUnit', $any($event).detail.value)"
                    >
                      @for (unit of periodUnits; track unit) {
                        <ion-select-option [value]="unit">{{ unit }}</ion-select-option>
                      }
                    </ion-select>
                  </ion-col>

                  <ion-col size="12" sizeMd="2">
                    <ion-input
                      label="Category"
                      labelPlacement="stacked"
                      fill="outline"
                      [value]="item.category"
                      (ionChange)="onUpdate(item.id, 'category', $any($event).detail.value)"
                    />
                  </ion-col>

                  <ion-col size="12" sizeMd="1" class="ion-text-end">
                    <ion-button
                      size="small"
                      color="danger"
                      (click)="recurrencyService.deleteItem(item.id)"
                    >
                      delete
                    </ion-button>
                  </ion-col>
                </ion-row>
              </ion-grid>
            </ion-item>
          } @empty {
            <ion-item>
              <ion-label color="medium">No recurrencies found.</ion-label>
            </ion-item>
          }
        </ion-list>

        <!-- Bottom Status Divs -->
         <div style="font-size: 0.8em;">
           <div>isLoading: {{ recurrencyService.isLoading() }}</div>
           <div>error: {{ errorDisplay() }}</div>
         </div>
      </ion-card-content>
  `,
})
export class RecurrencyListComponent {
  protected readonly recurrencyService = inject(RecurrencyService);
  protected readonly periodUnits = PERIOD_UNITS;
  protected readonly Number = Number;

  // 5 empty signals for the new recurrency inputs
  protected readonly newTitle = signal('');
  protected readonly newLastEvent = signal('');
  protected readonly newPeriodNb = signal('');
  protected readonly newPeriodUnit = signal<PeriodUnit | ''>('');
  protected readonly newCategory = signal('');

  protected readonly errorDisplay = computed(() => {
    const err = this.recurrencyService.error();
    return err ? `${err.code} - ${err.details}` : 'null';
  });

  protected onAdd(): void {
    const title = this.newTitle();
    const lastEvent = this.newLastEvent();
    const rawPeriodNb = this.newPeriodNb();
    const periodUnit = this.newPeriodUnit();
    const category = this.newCategory();

    const periodNb = Number(rawPeriodNb);

    if (
      title === '' ||
      lastEvent === '' ||
      rawPeriodNb === '' ||
      Number.isNaN(periodNb) ||
      periodUnit === '' ||
      category === ''
    ) {
      return;
    }

    this.recurrencyService.addItem(toNewRecurrency({
      title,
      lastEvent,
      periodNb,
      periodUnit,
      category,
    }));

    // Reset inputs
    this.newTitle.set('');
    this.newLastEvent.set('');
    this.newPeriodNb.set('');
    this.newPeriodUnit.set('');
    this.newCategory.set('');
  }

  protected onUpdate<K extends keyof Recurrency>(id: string, field: K, value: Recurrency[K]): void {
    this.recurrencyService.updateItem(id, { [field]: value } as Partial<Recurrency>);
  }
}
